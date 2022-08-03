import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('cart_items', (table) => {
        table.bigIncrements('id');
        table.bigInteger('cart_id').notNullable();
        table.bigInteger('product_id').notNullable();
        table.float('quantity').notNullable().defaultTo(1);
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('cart_items');
}


