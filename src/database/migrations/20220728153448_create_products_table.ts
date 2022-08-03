import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('products', (table) => {
        table.bigIncrements('id');
        table.string('name').notNullable();
        table.float('price').notNullable();
        table.string('photo').nullable();
        table.float('quantity').nullable();
        table.string('quantity_unit').nullable();
        table.float('weight').nullable();
        table.string('weight_unit').nullable();
        table.boolean('isPublished').notNullable().defaultTo(false);
        table.text('description').nullable();
        table.string('type').nullable();
        table.float('rating').nullable();
        table.bigInteger('category_id').notNullable();

        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('products');
}


