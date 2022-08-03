import * as dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    client: process.env.DB_CLIENT,
    connection: {   
      user: process.env.DB_USER,     
      host: process.env.DB_HOST,     
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,     
      database: process.env.DB_DATABASE,    
      password: process.env.DB_PASSWORD   
    },
    pool: { min: 1, max: 10 },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations"
    },
    seeds: {
      directory: "./src/database/seeders"
    }
  },

  staging: {
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
      directory: "./src/database/migrations"
    },
    seeds: {
      directory: "./src/database/seeders"
    }
  },

  production: {
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
      directory: "./src/database/migrations"
    },
    seeds: {
      directory: "./src/database/seeders"
    }
  }
};