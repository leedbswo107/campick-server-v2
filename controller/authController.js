const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const qs = require("qs");

const {
  getUserByUserName,
  createUser,
  loginDateInfoUpdate,
  duplicateEmailCheck,
} = require("../services/userServices");
const { createBingo, createMission } = require("../services/bingoService");

const { shuffle } = require("../utils/shuffle");
const { encrypt } = require("../utils/encrypt");

const { BINGO_AREA } = require("../constants/bingoArea");

const client_id = process.env.KAKAO_REST_API_KEY;
const redirect_uri = process.env.REDIRECT_URI;
const token_uri = process.env.TOKEN_URI;
const api_host = process.env.API_HOST;
const client_secret = process.env.CLIENT_SECRET;
const origin = process.env.ORIGIN;
const users = []; // 임시로 메모리에 사용자 데이터를 저장합니다.

app.use(cookieParser());

// 회원가입 함수
const register = async (req, res) => {
  try {
    const { username, password, nickname } = req.body;

    // 필수 필드 검사
    if (!username || !password || !nickname) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 비밀번호 길이 검사
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // 사용자 이름 형식 검사
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(username)) {
      return res.status(400).json({
        message:
          "Username must be at least 4 characters long and start with a letter",
      });
    }

    const hashedPassword = encrypt(password);
    const tr = await createUser(username, hashedPassword, nickname);
    await shuffle(BINGO_AREA);
    await createBingo(tr._id, BINGO_AREA);
    await createMission(tr._id, 0, 0, 0, 0, 1);

    res.status(200).json({ message: "User created", user: tr });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 로그인 함수
const login = async (req, res) => {
  const { username, password, loginDate } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await getUserByUserName(username);
    if (!user) {
      return res.status(404).json({ message: "nouser" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "failed" });
    }

    const token = jwt.sign(
      { username, id: user._id, nickname: user.nickname },
      "your_jwt_secret",
      {
        expiresIn: "1h",
      }
    );

    if (!token)
      return res.status(500).json({ message: "Token creation failed" });
    await loginDateInfoUpdate(user._id, loginDate);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
        sameSite: "none",
      })
      .json({
        id: user._id,
        username,
        nickname: user.nickname,
      });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // 만료 날짜를 과거로 설정하여 쿠키 삭제
    path: "/", // 모든 경로에서 쿠키 삭제
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out" });
};

const profile = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.json("토큰정보가 없어요");

  try {
    jwt.verify(token, "your_jwt_secret", {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  } catch (error) {
    console.error("Invalid token:", error);
    res.json("유효하지 않는 토큰 정보입니다.");
  }
};
const authorize = async (req, res) => {
  let scope = "profile_nickname,account_email";
  let scopeParam = "";
  if (scope) {
    scopeParam = `&scope=${scope}`;
  }
  res
    .status(302)
    .redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code${scopeParam}`
    );
};

const call = async (method, uri, param, header) => {
  let options = {
    method: method,
    headers: header,
  };
  if (param) {
    options.body = param;
  }

  try {
    const response = await fetch(uri, options);
    if (!response.ok) throw response;
    const data = await response.json();
    return data;
  } catch (err) {
    if (err.json) {
      const errorData = await err.json();
      return errorData;
    } else {
      return { message: "Unknown error" };
    }
  }
};
const kakaoLogin = async (info) => {
  const user = await getUserByUserName(info.email);
  const loginDate = new Date().toISOString();
  try {
    const token = jwt.sign(
      {
        username: info.email,
        id: user._id,
        nickname: user.nickname,
        password: user.password,
      },
      "your_jwt_secret",
      {
        expiresIn: "1h",
      }
    );
    await loginDateInfoUpdate(user._id, loginDate);
    return token;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};
const kakaoEmailEnroll = async (info) => {
  const tr = await createUser(info.email, "kakaoTest", info.profile.nickname);
  await shuffle(BINGO_AREA);
  await createBingo(tr._id, BINGO_AREA);
  await createMission(tr._id, 0, 0, 0, 0, 1);
  return;
};
const getUserId = async (sessionKey) => {
  const uri = api_host + "/v2/user/me";
  const param = {};
  const header = {
    "content-Type": "application/x-www-form-urlencoded",
    Authorization: "Bearer " + sessionKey,
  };
  var rtn = await call("POST", uri, param, header);
  const kakao_info = rtn.kakao_account;
  const kakaoEmail = kakao_info.email;
  const emailStatus = await duplicateEmailCheck(kakaoEmail);
  emailStatus === false && kakaoEmailEnroll(kakao_info);
  const token = await kakaoLogin(kakao_info);
  return token;
};
const redirect = async (req, res) => {
  const param = qs.stringify({
    grant_type: "authorization_code",
    client_id: client_id,
    redirect_uri: redirect_uri,
    client_secret: client_secret,
    code: req.query.code,
  });
  const header = { "content-type": "application/x-www-form-urlencoded" };
  var rtn = await call("POST", token_uri, param, header);
  req.session.key = rtn.access_token;
  const token = await getUserId(req.session.key);

  if (!token) {
    res.redirect(`${origin}`);
  } else {
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
        sameSite: "none",
      })
      .redirect(`${origin}`);
  }
};
module.exports = { register, login, logout, profile, authorize, redirect };
