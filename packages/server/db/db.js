const knexInitial = require('knex');

const knex = knexInitial({
  client: 'sqlite3',
  connection: {
    filename: __dirname + '/db.sqlite3',
  },
  useNullAsDefault: true
});

async function bookEvent(data, validator) {
  if (validator(data)) {
    await knex('users').insert(data);
    return { error: null };
  }
  return { error: 'Failed event booking.' };
}

const initializeDB = async (addTables, withData = false) => {
  if (addTables) {
    await knex.schema.createTable('events', table => {
      table.increments('id');
      // table.uuid('eventId').primary();
      table.string('name');
      table.string('time');
      table.string('date');
      table.string('phone');
      table.integer('counter');
      table.integer('faculty');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('states', table => {
      table.increments('id');
      table.string('stateType');
      table.string('jsonStringified');
    });
  }

  if (withData)
  await Promise.all([
    {
      "date": "27-07-2021",
      "time": "9:10",
      "counter": 1,
      "name": "sadaasdas",
      "phone": "+38062532523",
      "faculty": "ФІПТ"
    },
    {
      "time": "9:00",
      "date": "27-07-2021",
      "counter": 2,
      "name": "sadaasdas",
      "phone": "+38062532523",
      "faculty": "ФІПТ"
    },
    {
      "time": "13:10",
      "date": "27-07-2021",
      "counter": 1,
      "name": "sadaasdas",
      "phone": "+38062532523",
      "faculty": "ФІПТ"
    },
    {
      "time": "17:50",
      "date": "27-07-2021",
      "counter": 2,
      "name": "sadaasdas",
      "phone": "+38062532523",
      "faculty": "ФІПТ"
    },
    {
      "time": "15:10",
      "date": "27-07-2021",
      "counter": 2,
      "name": "sadaasdas",
      "phone": "+38062532523",
      "faculty": "ФІПТ"
    },
    {
      "time": "17:50",
      "date": "27-07-2021",
      "counter": 2,
      "name": "sadaasdas",
      "phone": "+38062532523",
      "faculty": "ФІПТ"
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
    // console.log(e);
  }
};

// initializeDB(true);

module.exports.db = knex;
module.exports.bookEvent = bookEvent;
module.exports.initializeDB = initializeDB;
