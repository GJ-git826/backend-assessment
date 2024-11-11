import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { registerWithReferral } from '../services/referralService';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try{
    const token = await loginUser(email, password);
    if(!token) {
      return res.status(401).json({message: 'Invalid credentials'});
    }
    res.status(200).json({token});
  } catch (error) {
    res.status(400).json({message: error});
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password, referralCode } = req.body;
  try {
    let user;

    if(referralCode) {
      user = await registerWithReferral(email, password, referralCode);
    } else {
      user = await registerUser(email, password);
    } 
    res.status(201).json(user);
  } catch (error) {
    console.log('Error in register endpoint:', error);
    res.status(400).json({ message: error });
  }
};


