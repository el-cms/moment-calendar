import moment from 'moment'

export default {
  get () {
    return [
      {type: 'task', title: 'First task', dueDate: moment('2017-11-12 22:00')},
      {type: 'task', title: 'First task', dueDate: moment('2017-11-12 00:00')},
      {
        type: 'event',
        title: 'First event',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-12 11:00'),
        fullDay: false
      },
      {
        type: 'event',
        title: 'First event',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-12 12:00'),
        fullDay: false
      },
      {
        type: 'event',
        title: 'Full day event',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-12 12:00'),
        fullDay: true
      },
      {
        type: 'event',
        title: '30 minutes',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-12 10:30'),
        fullDay: false
      },
      {
        id: 4,
        type: 'event',
        title: 'Too long',
        startDate: moment('2017-11-12 10:00'),
        endDate: moment('2017-11-13 12:00'),
        fullDay: false
      }

    ]
  }
}
