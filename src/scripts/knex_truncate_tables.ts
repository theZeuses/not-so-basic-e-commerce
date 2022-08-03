import { db } from '@providers/database/database.provider';

const allTables = [
  'users',
  'categories',
  'products',
  'discounts',
  'carts',
  'cart_items',
  'orders',
  'order_items'
];

export async function truncateTables(tables: string[] = allTables) {
    console.log(`Clearing Tables.....`);

    const promises = tables.map(table => {
        return db.raw('truncate table ' + table);
    });

    return Promise.all(promises).then(data => {
        console.log('All tables cleared');
    }).catch(err => {
        console.log(err);
    });
};