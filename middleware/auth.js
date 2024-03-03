const jwt = require("jsonwebtoken");

const { tokenSecret } = require("../config");

const signToken = (payload = {}, expiresIn = "1h") => {
  try {
    const accessTokenSecret = tokenSecret || "private";
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn,
      algorithm: "HS256",
    });
    return accessToken;
  } catch (err) {
    return null;
  }
};

const extractToken = (headers) => {
  const token = headers?.Authorization?.split(" ");
  if (token?.[0] === "Bearer") {
    return token?.[1];
  }
  return null;
};

const verifyToken = (token = "") => {
  const accessTokenSecret = tokenSecret || "private";
  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    if (decoded?.phoneNumber) {
      return { isValid: true, decoded };
    } else {
      return "Invalid token";
    }
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return "Token Expired";
    } else {
      return "Invalid Token";
    }
  }
};

module.exports = { signToken, verifyToken, extractToken };
