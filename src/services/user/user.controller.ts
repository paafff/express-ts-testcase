import { Request, Response } from 'express';
import * as userService from '../user/user.service';

interface CustomRequest extends Request {
  userId?: string;
}

export const register = async (req: CustomRequest, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const user = await userService.registerUser(email, password, username);
    console.log('🚀 ~ register ~ user:', user);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: CustomRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const getBalance = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId || ''; // Use empty string as default value if userId is undefined
    const balance = await userService.getUserBalance(userId);
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const topUp = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId || ''; // Assume userId is set in middleware
    const { amount } = req.body;
    console.log('🚀 ~ topUp ~ userId:', userId);
    console.log('🚀 ~ topUp ~ amount:', amount);
    const topUp = await userService.topUpBalance(userId, amount);
    res.status(201).json(topUp);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createTransaction = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId || ''; // Assume userId is set in middleware
    const { type, amount, description } = req.body;
    const transaction = await userService.createTransaction(
      userId,
      type,
      amount,
      description
    );
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const updatedUser = await userService.updateUser(userId, data);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
