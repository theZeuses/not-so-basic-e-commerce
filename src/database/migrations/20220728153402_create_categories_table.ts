import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('categories', (table) => {
        table.increments('id');
        table.string('name').notNullable();
        table.string('icon').notNullable();

        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('categories');
}
