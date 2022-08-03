import { knexConfig } from "@src/config";
import { Knex } from "knex";

export const mysqlConfig: Knex.Config = {
    ...knexConfig,
    client: 'mysql2'
}