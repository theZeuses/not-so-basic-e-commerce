import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('discounts', (table) => {
        table.bigIncrements('id');
        table.bigInteger('product_id').notNullable();
        table.float('percentage').notNullable();

        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('discounts');
}

