import moment from 'moment'

const randomChar = (size = 5) => Math.random().toString(36).substr(2, size)

export default {
  get () {
    return [
      {id: randomChar(), type: 'task', title: 'First task', dueDate: moment('2017-11-12 22:00')},
      {id: randomChar(), type: 'task', title: 'First task', dueDate: moment('2017-11-12 00:00')},
      {
        id: randomChar(),
        type: 'event',
        title: 'First event',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-12 11:00'),
        fullDay: false
      },
      {
        id: randomChar(),
        type: 'event',
        title: 'First event',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-12 12:00'),
        fullDay: false
      },
      {
        id: randomChar(),
        type: 'event',
        title: 'Full day event',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-12 12:00'),
        fullDay: true
      },
      {
        id: randomChar(),
        type: 'event',
        title: 'Meeting with Joan',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-12 10:30'),
        fullDay: false
      },
      {
        id: randomChar(),
        type: 'event',
        title: 'Too long',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-13 12:00'),
        fullDay: false
      }
    ]
  },
  getMultiple () {
    return {
      John: [...this.get()],
      Joan: [
        {id: randomChar(), type: 'task', title: 'First task', dueDate: moment('2017-11-12 22:00')},
        {
          id: randomChar(),
          type: 'event',
          title: 'First event',
          startDate: moment('2017-11-12 14:00'),
          endDate: moment('2017-11-12 15:00'),
          fullDay: false
        },
        {
          id: randomChar(),
          type: 'event',
          title: 'Full day event',
          startDate: moment('2017-11-13 09:00'),
          endDate: moment('2017-11-13 08:00'),
          fullDay: true
        },
        {
          id: randomChar(),
          type: 'event',
          title: 'Meeting with John',
          startDate: moment('2017-11-12 10:00'),
          endDate: moment('2017-11-12 10:30'),
          fullDay: false
        }
      ]
    }
  }
}
