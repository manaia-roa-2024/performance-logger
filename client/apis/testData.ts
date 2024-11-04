import LogCollection from "../../models/classes/LogCollection";

export const testData = {
  id: 0,
  logGroups: [
    {
      id: 0,
      name: '5k run',
      logRecords: [
        {
          id: 0,
          value: 600,
          date: '2024-11-03'
        },
        {
          id: 1,
          value: 590,
          date: '2024-11-02'
        },
        {
          id: 2,
          value: 605,
          date: '2024-11-01'
        }
      ]
    },
    {
      id: 1,
      name: '10k run',
      logRecords: [
        {
          id: 0,
          value: 1500,
          date: '2024-11-03'
        },
        {
          id: 1,
          value: 1480,
          date: '2024-11-02'
        }
      ]
    },
    {
      id: 2,
      name: 'Cycling',
      logRecords: [
        {
          id: 0,
          value: 3600,
          date: '2024-11-03'
        },
        {
          id: 1,
          value: 3500,
          date: '2024-11-02'
        },
        {
          id: 2,
          value: 3650,
          date: '2024-11-01'
        }
      ]
    },
    {
      id: 3,
      name: 'Swimming',
      logRecords: [
        {
          id: 0,
          value: 900,
          date: '2024-11-03'
        },
        {
          id: 1,
          value: 920,
          date: '2024-11-02'
        }
      ]
    }
  ]
} as LogCollection