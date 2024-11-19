import randomDateTime from "../../../randomDateTime.js"
import Util from "../../Util.ts"

const rdt = (start) =>{ // random datetime iso format
  return randomDateTime(start || new Date(2024, 0, 1), new Date(2024, 10, 9)).toISOString()
}

const rd = (start) =>{
  return randomDateTime(start || new Date(start), new Date(2025, 10, 9)).toISOString().substring(0, 10)
}

const seedLogGroups = [
  /*{
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
  },*/
  {
    name: 'Bulking Log',
    metric: 'mass',
    unit: 'kg',
    created: rdt()
  },
  {
    name: "Height Log",
    metric: "length",
    unit: 'cm',
    created: rdt()
  },
  {
    name: 'Steps Log',
    metric: 'unit',
    unit: 'unit',
    created: rdt()
  }
]

const getPrev = (records, groupId) =>{
  return records[records.length - 1]?.logGroupId === groupId ? records[records.length - 1] : null
}

const seedRecords = (function(){
  const records = []


  let recordDate = randomDateTime(new Date(2023, 11, 31), new Date(2024, 5, 30))
  /*for (let i = 0; i < 49; i++){
    const lg = seedLogGroups[1]

    recordDate.setDate(recordDate.getDate() + 1)

    records.push({
      value: (8 + Math.random() * 30).toFixed(2),
      date: Util.toISODate(recordDate),
      created: rdt(new Date(lg.created)),
      logGroupId: 2
    })
  }*/


  recordDate = randomDateTime(new Date(2023, 11, 31), new Date(2024, 5, 30))

  for (let i = 0; i < 70; i++){
    const lg = seedLogGroups[0]

    recordDate.setDate(recordDate.getDate() + 1)
    const prev = getPrev(records, 1)
    records.push({
      value: (Number(prev?.value ?? 60) + (Math.random() * 0.35 - 0.1)).toFixed(1),
      date: Util.toISODate(recordDate),
      created: rdt(new Date(lg.created)),
      logGroupId: 1
    })
  }
 
  recordDate = randomDateTime(new Date(2023, 11, 31), new Date(2024, 5, 30))

  for (let i = 0; i < 70; i++){
    const lg = seedLogGroups[1]

    recordDate.setDate(recordDate.getDate() + 1)

    records.push({
      value: (1.4 + (0.0025 * i)).toFixed(4),
      date: Util.toISODate(recordDate),
      created: rdt(new Date(lg.created)),
      logGroupId: 2
    })
  }

  recordDate = randomDateTime(new Date(2023, 11, 31), new Date(2024, 5, 30))

  for (let i = 0; i < 104; i++){
    const lg = seedLogGroups[2]

    recordDate.setDate(recordDate.getDate() + 1)
    const prev = getPrev(records, 1)
    records.push({
      value: Math.round(Number(prev?.value ?? 10000) + (Math.random() * 4000 - 2000)),
      date: Util.toISODate(recordDate),
      created: rdt(new Date(lg.created)),
      logGroupId: 3
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

