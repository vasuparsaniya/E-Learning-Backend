import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const uuidGenerateHelper = () => {
  return uuidv4();
};

export const bcryptPassword = async (data: {
  password: string;
  saltRounds?: number;
}) => {
  const { password, saltRounds = 10 } = data;
  return await bcrypt.hash(password, saltRounds);
};

export const compareHashPassword = async (data: {
  password: string;
  hashPassword: string;
}) => {
  const { password, hashPassword } = data;
  return await bcrypt.compare(password, hashPassword);
};

//**JWT TOKEN */
