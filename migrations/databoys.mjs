import knexInitial from 'knex';

const knex = knexInitial({
  client: 'sqlite3',
  connection: {
    filename: './lib/db.sqlite3',
  },
  useNullAsDefault: true
});

export const initializeDB = async (addTables) => {
  if (addTables) {
    await knex.schema.createTable('events', table => {
      table.increments('id');
      // table.uuid('eventId').primary();
      table.string('name');
      table.string('date');
      table.string('phone');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  await Promise.all([
    {
      "name": "asdas",
      "phone": "dasddasd",
      "date": "Wed May 05 2021 09:00:00 GMT+0300"
    },
    {
      "name": "asdasdasd",
      "phone": "asdasds",
      "date": "Wed May 12 2021 09:00:00 GMT+0300"
    },
    {
      "name": "dasdasd",
      "phone": "asdas",
      "date": "Wed May 19 2021 09:00:00 GMT+0300"
    },
    {
      "name": "asd",
      "phone": "ddasdas",
      "date": "Wed May 19 2021 09:10:00 GMT+0300"
    },
    {
      "name": "asdas",
      "phone": "dasdasd",
      "date": "Fri May 28 2021 09:00:00 GMT+0300"
    }
  ].map(async (i) => {
    await knex('events').insert(i)
  }));
  // console.log(await knex('events').select('*'))

  try {

    // Create a table
    // await knex.schema
    //   .createTable('events', table => {
    //     table.increments('id');
    //     table.string('name');
    //     table.string('date');
    //     table.string('phone');
    //   })
    //   // ...and another
    //   .createTable('miscdata', table => {
    //     // TODO: change later
    //     table.increments('id');
    //     table.string('account_name');
    //     table
    //       .integer('user_id')
    //       .unsigned()
    //       .references('users.id');
    //   })
    // //
    // // Then query the table...
    // const insertedRows = await knex('users').insert({ user_name: 'Tim' })
    //
    // // ...and using the insert id, insert into the other table.
    // await knex('accounts').insert({ account_name: 'knex', user_id: insertedRows[0] })
    //
    // // Query both of the rows.
    // const selectedRows = await knex('users')
    //   .join('accounts', 'users.id', 'accounts.user_id')
    //   .select('users.user_name as user', 'accounts.account_name as account')
    //
    // // map over the results
    // const enrichedRows = selectedRows.map(row => ({ ...row, active: true }))
    //
    // // Finally, add a catch statement
  } catch(e) {
    console.log(e);
  }
};

// initializeDB(true);
// (async () => {
//   await knex.schema.createTable('config', table => {
//     table.increments('id');
//     table.string('name');
//     table.string('jsonvalue');
//     table.timestamp('created_at').defaultTo(knex.fn.now());
//     table.timestamp('updated_at').defaultTo(knex.fn.now());
//   });
// })();
