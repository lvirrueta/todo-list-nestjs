import { Repository, DataSource, EntityTarget, QueryRunner, FindManyOptions } from 'typeorm';
import { ID } from '../application/types/types.types';
import { IGenericRepository } from '../domain/irepositories/i-repository.repository.interface';
import { ThrowError } from '../application/utils/throw-error';
import { Errors } from '../application/error/error.constants';

export abstract class GenericRepository<E> extends Repository<E> implements IGenericRepository<E> {
  constructor(public target: EntityTarget<E>, public dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
  }

  /** list Entities */
  public async listEntities(opt?: FindManyOptions<E>, query?: QueryRunner): Promise<E[]> {
    const { where } = { ...opt };

    const repository = this.getSimpleOrTransaction(query);

    return await repository.find({ where });
  }

  /** list Entities and Count */
  listEntitiesAndCount(query?: QueryRunner): Promise<[E[], number]> {
    throw new Error('Method not implemented.');
  }

  /** find One Entity by id */
  public async findOneEntity(id: ID, opt?: FindManyOptions<E>, query?: QueryRunner): Promise<E> {
    let { where } = { ...opt };
    const repository = this.getSimpleOrTransaction(query);

    where = { ...where, id } as any;

    return await repository.findOne({ where });
  }

  /** save Entity */
  public async saveEntity(entity: E, query?: QueryRunner): Promise<E> {
    const repository = this.getSimpleOrTransaction(query);

    return await repository.save(entity);
  }

  /** update Entity */
  public async updateEntity(entity: E, query?: QueryRunner): Promise<E> {
    const repository = this.getSimpleOrTransaction(query);

    const entityF = await repository.findOne({ where: { id: entity['id'] } as any });
    if (!entityF) ThrowError.httpException(Errors.GenericRepository.UpdateEntity);

    return await repository.save(entity);
  }

  /** delete entity */
  public async deleteEntity(id: ID, query?: QueryRunner): Promise<E> {
    const repository = this.getSimpleOrTransaction(query);

    const entityF = await repository.findOne({ where: { id } as any });
    if (!entityF) ThrowError.httpException(Errors.GenericRepository.DeleteEntity);

    return await repository.remove(entityF);
  }

  /** soft delete entity */
  public async softDeleteEntity(id: ID, query?: QueryRunner): Promise<E> {
    const repository = this.getSimpleOrTransaction(query);

    const entityF = await repository.findOne({ where: { id } as any });
    if (!entityF) ThrowError.httpException(Errors.GenericRepository.DeleteEntity);

    await repository.softDelete(id);
    return entityF;
  }

  /** create and start transaction */
  public async createAndStartTransaction(): Promise<QueryRunner> {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();

    return transaction;
  }

  /** commit transaction */
  public async commitTransaction(query: QueryRunner): Promise<void> {
    return await query.commitTransaction();
  }

  /** rollback transaction */
  public async rollbackTransaction(query: QueryRunner): Promise<void> {
    return await query.rollbackTransaction();
  }

  /** release transaction */
  public async releaseTransaction(query: QueryRunner): Promise<void> {
    return await query.release();
  }

  /** get queryRunner repository or a simple repository */
  protected getSimpleOrTransaction(query?: QueryRunner) {
    return query ? query.manager.getRepository(this.target) : this.dataSource.getRepository(this.target);
  }
}
