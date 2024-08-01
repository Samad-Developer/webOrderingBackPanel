import jwt from "jsonwebtoken";

const verifyToken = (Token) => {
  return jwt.verify(Token, "hello123");
};

export default verifyToken;
