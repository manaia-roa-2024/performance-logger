import randomDateTime from "../../../randomDateTime.js"

const rdt = (start) =>{ // random datetime iso format
  return randomDateTime(start || new Date(2024, 0, 1), new Date(2024, 10, 9)).toISOString()
}

const rd = (start) =>{
  return randomDateTime(start || new Date(start), new Date(2025, 10, 9)).toISOString().substring(0, 10)
}

const seedLogGroups = [
  {
    name: 'New Performance Group',
    metric: 'length',
    unit: 'M',
    created: rdt()
  },
  {
    name: 'Free Kick Distance',
    metric: 'length',
    unit: 'M',
    created: rdt()
  },
  {
    name: 'Weight Log',
    metric: 'mass',
    unit: 'kg',
    created: rdt()
  },
  {
    name: "John's Height",
    metric: "length",
    unit: 'cm',
    created: rdt()
  }
]

const seedRecords = (function(){
  const records = []

  for (let i = 0; i < 49; i++){
    const lg = seedLogGroups[1]

    records.push({
      value: (8 + Math.random() * 30).toFixed(2),
      date: rd(new Date(lg.created)),
      created: rdt(new Date(lg.created)),
      logGroupId: 2
    })
  }

  for (let i = 0; i < 49; i++){
    const lg = seedLogGroups[2]

    records.push({
      value: 85 - (0.1 * i),
      date: rd(new Date(lg.created)),
      created: rdt(new Date(lg.created)),
      logGroupId: 3
    })
  }

  for (let i = 0; i < 49; i++){
    const lg = seedLogGroups[3]

    records.push({
      value: Math.round(140 + (0.25 * i)),
      date: rd(new Date(lg.created)),
      created: rdt(new Date(lg.created)),
      logGroupId: 4
    })
  }

  return records
})()

export async function seed(knex){
  await knex('logRecord').del()
  await knex('logGroup').del()
  await knex.raw("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'logGroup'");
  await knex.raw("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'logRecord'");

  await knex('logGroup').insert(seedLogGroups)
  await knex('logRecord').insert(seedRecords)
}

