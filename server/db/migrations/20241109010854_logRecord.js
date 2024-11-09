/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('logRecord', table =>{
    table.increments('id')
    table.double('value')
    table.date('date')
    table.datetime('created')
    table.integer('logGroupId').references('logGroup.id')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('logRecord')
};
