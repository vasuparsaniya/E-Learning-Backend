export type UsersModelType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export type UsersModelCreationType = Omit<
  UsersModelType,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;
