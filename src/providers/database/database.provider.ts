import { knex, Knex } from 'knex';
import { mysqlConfig } from './mysql/mysql.config';

export const db:Knex = knex(mysqlConfig);