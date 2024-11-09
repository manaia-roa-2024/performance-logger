/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('logGroup', table =>{
    table.increments('id')
    table.string('name')
    table.datetime('created')
    table.string('metric')
    table.string('unit')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('logGroup')
};
