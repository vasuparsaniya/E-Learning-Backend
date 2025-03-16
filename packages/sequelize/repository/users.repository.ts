import UsersModel from '../models/users.model';
import { GenericRepository } from './sequelize.repository';

const UsersModelRepo = new GenericRepository<UsersModel>(UsersModel);

export const getUserPkIdRepo = UsersModelRepo.findByPkId;
export const getUserRepo = UsersModelRepo.getData;
export const getAllUsersRepo = UsersModelRepo.findAll;
export const createUserRepo = UsersModelRepo.create;
export const updateUserRepo = UsersModelRepo.update;
export const deleteUserRepo = UsersModelRepo.delete;
