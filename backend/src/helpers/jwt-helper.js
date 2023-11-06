import jwt from "jsonwebtoken";

const verifyJWTToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY, { maxAge: 3600 });
    const { exp, iat } = decoded;

    return !(iat * 1000 > Date.now());
  } catch (error) {
    return false;
  }
};

export function decodeJwtToken(token) {
  if (!verifyJWTToken(token)) return undefined;
  return jwt.decode(token, {});
}
