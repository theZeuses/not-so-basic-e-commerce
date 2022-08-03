import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.string('avatar').nullable();
        table.string('phone_number').nullable();
        table.string('address').notNullable();
        table.string('role').notNullable();

        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}

