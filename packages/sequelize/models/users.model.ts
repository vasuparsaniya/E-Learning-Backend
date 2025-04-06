import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { UsersModelCreationType, UsersModelType } from '../types/users.type';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'users',
  modelName: 'users',
})
class UsersModel extends Model<UsersModelType, UsersModelCreationType> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataType.BIGINT,
  })
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  first_name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  last_name!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  uuid!: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  last_login!: Date;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @DeletedAt
  deleted_at!: Date;
}

export default UsersModel;
