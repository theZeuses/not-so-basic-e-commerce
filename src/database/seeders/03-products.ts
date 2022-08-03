import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    //await knex("table_name").del();

    // Inserts seed entries
    await knex("products").insert([
        { 
            id: 1, 
            name: 'Roast Chicken',
            price: 169,
            photo: 'cdn:path/to/image',
            quantity: 1,
            quantity_unit: 'piece',
            weight: 1,
            weight_unit: 'kg',
            isPublished: false,
            description: 'Fresh meat, best for roasting.',
            type: 'Meat',
            category_id: 1
        },
        { 
            id: 2, 
            name: 'Horina Chingri',
            price: 169,
            photo: 'cdn:path/to/image',
            quantity: 35,
            quantity_unit: 'piece',
            weight: 250,
            weight_unit: 'gm',
            isPublished: true,
            description: 'Small Shrimp Horina from the enclosure of Bangladesh.',
            type: 'Fish',
            category_id: 1,
            rating: 4
        }
    ]);
};
