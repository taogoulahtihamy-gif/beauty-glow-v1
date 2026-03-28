import jwt from 'jsonwebtoken';

export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      fullName: user.full_name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
