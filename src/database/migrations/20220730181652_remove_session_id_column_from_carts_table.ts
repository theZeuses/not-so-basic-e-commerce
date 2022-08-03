import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('carts', (table) => {
        table.dropColumn('session_id');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('carts', (table) => {
        table.string('session_id').nullable().after('user_id');
    });
}
