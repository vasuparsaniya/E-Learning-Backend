import { CreateOptions, Optional } from 'sequelize';
import UsersModel from '../models/users.model';
import { GenericRepository } from './sequelize.repository';

const UsersModelRepo = new GenericRepository<UsersModel>(UsersModel);

/**
 *  We use the .bind(UsersModelRepo) method when exporting these repository functions
 *  to ensure that the 'this' context inside each method refers to the UsersModelRepo instance.
 *  Without binding, calling these functions directly (e.g., getUserPkIdRepo())
 *  would result in 'this' being undefined, causing runtime errors when accessing instance properties.
 */

export const getUserPkIdRepo = UsersModelRepo.findByPkId.bind(UsersModelRepo);
export const getUserRepo = UsersModelRepo.getData.bind(UsersModelRepo);
export const getAllUsersRepo = UsersModelRepo.findAll.bind(UsersModelRepo);
export const createUserRepo = UsersModelRepo.create.bind(UsersModelRepo);
export const updateUserRepo = UsersModelRepo.update.bind(UsersModelRepo);
export const deleteUserRepo = UsersModelRepo.delete.bind(UsersModelRepo);

/**This is also valid when you want to any customization like last_login type */
// export const createUserRepo = (
//   data: Optional<UsersModelCreationType, 'last_login'>,
//   options?: CreateOptions,
// ) => UsersModelRepo.create(data, options);

// export const getUserRepo = (options: {where:}) =>
//   UsersModelRepo.getData(options);
