import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('order_items', (table) => {
        table.bigIncrements('id');
        table.bigInteger('order_id').notNullable();
        table.bigInteger('product_id').notNullable();
        table.float('quantity').notNullable();
        table.float('per_price').notNullable();
        table.float('after_discount_per_price').notNullable();

        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('order_items');
}

