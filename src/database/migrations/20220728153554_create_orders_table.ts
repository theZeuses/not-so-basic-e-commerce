import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('orders', (table) => {
        table.bigIncrements('id');
        table.bigInteger('user_id').notNullable();
        table.float('amount').notNullable();
        table.float('after_discount_amount').notNullable();
        table.string('status').notNullable();

        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('orders');
}

