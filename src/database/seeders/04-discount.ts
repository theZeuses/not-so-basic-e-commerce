import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    //await knex("table_name").del();

    // Inserts seed entries
    await knex("discounts").insert([
        { 
            id: 1, 
            product_id: 2,
            percentage: 5
        }
    ]);
};
