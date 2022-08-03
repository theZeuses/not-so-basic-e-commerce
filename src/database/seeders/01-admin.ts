import { Knex } from "knex";
import * as argon from 'argon2';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    //await knex("table_name").del();

    // Inserts seed entries
    await knex("users").insert([
        { 
            id: 1, 
            email: "admin@admin.com",
            password: await argon.hash('password'),
            name: "Admin",
            address: "address, address",
            role: "ADMIN"
        }
    ]);
};
