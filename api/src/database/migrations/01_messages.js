export const up = function(knex) {
  return knex.schema.createTable('messages',(table)=>{
    table.bigIncrements();
    table.text('contents','longtext');
    table.bigInteger('user_id')
    .references('id')
    .inTable('users')
    .notNullable()
    .onUpdate('CASCADE')
    .onDelete('CASCADE');
    table.bigInteger('created_at').notNullable();
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('messages')
};
