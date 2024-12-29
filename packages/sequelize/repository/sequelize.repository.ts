import {
  Model,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  ModelStatic,
  Attributes,
  RestoreOptions,
} from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';

export class Repository<M extends Model> {
  private model: ModelStatic<M>; // Use ModelStatic<T> instead of typeof Model

  constructor(model: ModelStatic<M>) {
    this.model = model;
  }

  async create(
    data: MakeNullishOptional<M['_creationAttributes']>,
    options?: CreateOptions,
  ): Promise<M> {
    return (await this.model.create(data, options)) as M;
  }

  async findById(
    id: number | string,
    options?: FindOptions,
  ): Promise<M | null> {
    return (await this.model.findByPk(id, options)) as M | null;
  }

  async findAll(options?: FindOptions): Promise<M[]> {
    return (await this.model.findAll(options)) as M[];
  }

  async update(
    updateData: Partial<M['_attributes']>,
    options: Omit<UpdateOptions<Attributes<Model>>, 'returning'> & {
      returning?: Exclude<
        UpdateOptions<Attributes<Model>>['returning'],
        undefined | false
      >;
    },
  ): Promise<[number, M[]] | [number]> {
    return await this.model.update(updateData, {
      ...options,
      returning: options.returning ?? false,
    });
  }

  async delete(options: RestoreOptions<Attributes<M>>): Promise<number> {
    return await this.model.destroy({ ...options });
  }
}
