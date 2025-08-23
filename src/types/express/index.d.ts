// src/types/express/index.d.ts
import { Roles } from '../../models/roles';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _id: string;
      jti: string;
      name: string;
      email: string;
      role: Roles;
    };
  }
}
