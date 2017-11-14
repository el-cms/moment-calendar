import moment from 'moment'

/**
 * @mixin
 */
export default {
  methods: {
    /**
     * Creates a grid to be displayed in month views
     *
     * @param {Object}     targetDate - Moment object for the targeted date
     * @param {Array|null} events     - List of events or null
     * @public
     */
    fillGrid (targetDate, events = null) {
      this.processing = true
      this.grid = {}
      const out = {}
      const year = targetDate.year()   // Year
      const month = targetDate.month() // This is the month, JS format (months starting at 0)
      // Creating current year/month in results
      out[year] = {}
      out[year][month] = {}

      // First day of month to display
      const day = moment([year, month, 1])

      // Fill the current month
      const currentMonthLength = moment(day).month(month + 1).date(-1).date()
      for (let i = 0; i <= currentMonthLength; i++) {
        out[year][month][i] = []
      }
      var displayStartDate = moment([year, month, 1]).startOf('month')
      var displayEndDate = moment([year, month, 1]).endOf('month')

      // Fill the preceding days
      // Check for first day of month, in a week
      const dayInWeek = day.day()
      if (dayInWeek !== 0) {
        const prevDay = moment(day).day(-1)
        const prevDayYear = prevDay.year()
        const prevDayMonth = prevDay.month()
        if (!Object.prototype.hasOwnProperty.call(out, prevDayYear)) {
          out[prevDayYear] = {}
        }
        out[prevDayYear][prevDayMonth] = {}
        for (let i = dayInWeek - 1; i > 0; i--) {
          out[prevDayYear][prevDayMonth][moment(day).date(-i).date()] = []
        }
      }

      // Fill the next days if needed:
      const nextMonthDelta = 35 - (currentMonthLength + dayInWeek)
      if (nextMonthDelta > 0) {
        const nextMonthDay = moment(day).month(day.month() + 1)
        const nextMonthYear = nextMonthDay.year()
        const nextMonthMonth = nextMonthDay.month()
        if (!Object.prototype.hasOwnProperty.call(out, nextMonthYear)) {
          out[nextMonthYear] = {}
        }
        out[nextMonthYear][nextMonthMonth] = {}
        for (let i = 0; i < nextMonthDelta; i++) {
          out[nextMonthYear][nextMonthMonth][i] = []
        }
      }

      // Adding events
      if (events !== null) {
        for (const index in events) {
          let eDate = null
          let e = events[index]
          if (
            e.type === 'task' &&
            e.dueDate &&
            e.dueDate.isBetween(displayStartDate, displayEndDate)
          ) {
            eDate = e.dueDate
            // Add the task
            out[eDate.year()][eDate.month()][eDate.date() - 1].push(e)
          } else if (
            e.type === 'event' &&
            e.startDate &&
            e.endDate &&
            (
              e.startDate.isBetween(displayStartDate, displayEndDate) ||
              e.endDate.isBetween(displayStartDate, displayEndDate)
            )
          ) {
            // Find days concerned by this event
            // @todo this, but better
            const startDay = e.startDate.clone().startOf('day')
            const endDay = e.endDate.clone().endOf('day')
            for (const y in out) {
              if (e.startDate.year() === parseInt(y, 10) || e.endDate.year() === parseInt(y, 10)) {
                for (const m in out[y]) {
                  if (e.startDate.month() === parseInt(m, 10) || e.endDate.month() === parseInt(m, 10)) {
                    // Days
                    for (const d in out[y][m]) {
                      if (moment([y, m, d]).hour(1).isBetween(startDay, endDay)) {
                        out[y][m][d - 1].push(e)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.processing = false
      return out
    }
  }
}
