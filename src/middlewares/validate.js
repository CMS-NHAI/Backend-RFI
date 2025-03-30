import jwt from 'jsonwebtoken'
import { STATUS_CODES } from '../constants/statusCodeConstants.js'
import dotenv from 'dotenv';
dotenv.config();

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message, 
      });
    }

    next(); 
  };
};



// Middleware to check JWT token
export  const validateToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1] // Extract the token from Authorization header

  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: 'Authorization token is required.',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = decoded

    next() 
  } catch (err) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token.',
    })
  }
}


