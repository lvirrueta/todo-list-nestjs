import { QueryRunner } from 'typeorm';

import { ID } from 'src/common/application/types/types.types';

/**
 * @param M Model Entity
 */
export interface IGenericRepository<E = any> {
  listEntities(query?: QueryRunner): Promise<E[]>;
  listEntitiesAndCount(query?: QueryRunner): Promise<[E[], number]>;
  findOneEntity(id: ID, query?: QueryRunner): Promise<E>;
  saveEntity(entity: E, query?: QueryRunner): Promise<E>;
  updateEntity(entity: E, query?: QueryRunner): Promise<E>;
  deleteEntity(id: ID, query?: QueryRunner): Promise<E>;
  softDeleteEntity(id: ID, query?: QueryRunner): Promise<E>;
  createAndStartTransaction(): Promise<QueryRunner>;
  commitTransaction(query: QueryRunner): Promise<void>;
  rollbackTransaction(query: QueryRunner): Promise<void>;
  releaseTransaction(query: QueryRunner): Promise<void>;
}
