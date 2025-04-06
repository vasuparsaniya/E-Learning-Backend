import bcrypt from 'bcrypt';
import uuid from 'uuid';

export const uuidGenerateHelper = () => {
  return uuid.v4();
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
