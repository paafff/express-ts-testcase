// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// interface CustomRequest extends Request {
//   userId?: string;
// }

// const authMiddleware = (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//       userId: string;
//     };
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// export default authMiddleware;

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  userId?: string;
}

const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authMiddleware;
