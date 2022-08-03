import { Knex } from 'knex'; 
import * as dotenv from "dotenv";
dotenv.config();

export const knexConfig: Knex.Config = {   
  client: process.env.DB_CLIENT,  
  connection: {   
    user: process.env.DB_USER,     
    host: process.env.DB_HOST,     
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,     
    database: process.env.DB_DATABASE,    
    password: process.env.DB_PASSWORD   
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "../database/migrations"
  },
  seeds: {
    directory: "../database/seeders"
  },
  debug: true
}