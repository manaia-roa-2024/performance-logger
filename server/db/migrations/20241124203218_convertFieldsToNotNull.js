/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('logGroup', table =>{
    table.dropNullable('name')
    table.dropNullable('created')
    table.dropNullable('metric')
    table.dropNullable('unit')
    table.dropNullable('groupBy')
  })

  await knex.schema.alterTable('logRecord', table =>{
    table.dropNullable('value')
    table.dropNullable('date')
    table.dropNullable('created')
    table.dropNullable('logGroupId')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable('logGroup', table =>{
    table.setNullable('name')
    table.setNullable('created')
    table.setNullable('metric')
    table.setNullable('unit')
    table.setNullable('groupBy')
  })

  await knex.schema.alterTable('logRecord', table =>{
    table.setNullable('value')
    table.setNullable('date')
    table.setNullable('created')
    table.setNullable('logGroupId')
  })
};
