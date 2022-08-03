import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    //await knex("table_name").del();

    // Inserts seed entries
    await knex("categories").insert([
        { 
            id: 1, 
            name: 'Food',
            icon: 'cdn:path/to/image'
        }
    ]);
};
