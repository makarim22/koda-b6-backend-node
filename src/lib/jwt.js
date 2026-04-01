import jwt from 'jsonwebtoken';

class JWTError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JWTError';
  }
}

export function generateJWT(userID, email, config) {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + Math.floor(config.Expiration / 1000);

  const payload = {
    user_id: userID,
    email: email,
    iat: now,
    exp: expiresAt,
    iss: config.Issuer,
  };

  try {
    const token = jwt.sign(payload, config.Secret, {
      algorithm: 'HS256',
    });
    return token;
  } catch (err) {
    throw new JWTError(`failed to sign token: ${err.message}`);
  }
}

export function verifyJWT(tokenString, config) {
  try {
    const decoded = jwt.verify(tokenString, config.Secret, {
      algorithms: ['HS256'],
      issuer: config.Issuer,
    });

    const claims = {
      user_id: decoded.user_id,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
      iss: decoded.iss,
    };

    return claims;
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new JWTError(`failed to parse token: ${err.message}`);
    }
    if (err.name === 'TokenExpiredError') {
      throw new JWTError(`token expired at ${new Date(err.expiredAt).toISOString()}`);
    }
    throw new JWTError(`invalid token: ${err.message}`);
  }
}

export { JWTError };