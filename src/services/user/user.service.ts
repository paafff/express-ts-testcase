import prisma from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });

  await prisma.balance.create({
    data: {
      userId: createdUser.id,
    },
  });

  return createdUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '', {
    expiresIn: '1h',
  });
  return { user, token };
};

export const getUserBalance = async (userId: string) => {
  return await prisma.balance.findUnique({ where: { userId } });
};

export const topUpBalance = async (userId: string, amount: number) => {
  const topUp = await prisma.topUp.create({
    data: {
      amount,
      userId,
    },
  });
  await prisma.balance.update({
    where: { userId },
    data: { amount: { increment: amount } },
  });
  return topUp;
};

export const createTransaction = async (
  userId: string,
  type: string,
  amount: number,
  description?: string
) => {
  const transaction = await prisma.transaction.create({
    data: {
      type,
      amount,
      description,
      userId,
      invoice: `INV-${Math.random().toString(36).substring(7)}`,
    },
  });
  await prisma.balance.update({
    where: { userId },
    data: { amount: { decrement: amount } },
  });
  return transaction;
};

export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      balance: true,
    },
  });
};

export const updateUser = async (
  userId: string,
  data: { email?: string; password?: string; username?: string }
) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
};
