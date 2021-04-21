
export const up = function(knex) {
  return knex.schema.createTable('users',(table)=>{
    table.bigIncrements().primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.text('password').notNullable().comment('Encrypted password');
    table.bigInteger('created_at').notNullable();
    table.bigInteger('last_entry').notNullable();
    table.integer('status').defaultTo(2).comment(`
      0 - Offline
      1 - Absent
      2 - Online
    `);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('users')
};
