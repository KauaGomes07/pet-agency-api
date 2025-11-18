import "express";
import { Pet } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      clientId?: string;
      clientRole?: string;
      clientEmail?: string;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      pet?: Pet;
      clientId?: string; 
    }
  }
}
