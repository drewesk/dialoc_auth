
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', table => {
    table.increments();
    table.text('name').notNullable
    table.text('email').unique().notNullable();
    table.text('password').notNullable();
    table.datetime('date').notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    // table.integer('antipode_id').references('antipode.id').unsigned().onDelete('cascade');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user');
};
