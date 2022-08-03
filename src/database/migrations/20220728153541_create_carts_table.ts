import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('carts', (table) => {
        table.bigIncrements('id');
        table.bigInteger('user_id').nullable();
        table.string('session_id').nullable();
        table.boolean('followedUp').notNullable().defaultTo(false);

        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('carts');
}

