<template>
  <div class="mc-cal-view mc-cal-view--month">

    <div class="mc-cal-links" v-if="displayLinks">
      <div class="link">
        <button @click="prevMonth()">&lt;</button>
      </div>
      <div class="link">
        <button @click="targetNow()">Current month</button>
      </div>
      <div class="header">
        <span class="string">Displayed month:</span>
        {{targetDate.format('YYYY, MMMM')}}
      </div>
      <div class="link">
        <button @click="nextMonth()">&gt;</button>
      </div>
    </div>

    <div class="mc-headers" v-if="displayDayNames">
      <div class="day" v-for="d in days">{{d}}</div>
    </div>

    <div class="mc-days">
      <template v-for="y, yIndex in grid" v-if="!processing">
        <template v-for="m, mIndex in y">
          <div v-for="d, index in m" class="day"
               :class="{
            'out-of-scope': parseInt(targetDate.month(), 10) !== parseInt(mIndex,10),
            'current-day' : isToday([yIndex, mIndex, index])
                }">
            <a class="header" href="#" @click="$emit('viewDay', {type:'day', y:yIndex, m:mIndex, d:index})">
              {{parseInt(index, 10) + 1}}
            </a>
            <div class="events" v-if="displayEvents">
              <component v-for="e, index in d"
                         :data="e"
                         :key="index"
                         :is="e.type === 'event' ? 'Event' : 'Task'"></component>
            </div>
          </div>
        </template>
      </template>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import Task from '../calendar-widget/widget-task'
  import Event from '../calendar-widget/widget-event'

  export default {
    name: 'calendar-view-month',
    props: {
      events: {required: false, type: Array, default: () => []},
      baseDay: {required: false, default: () => moment()}, // @todo Type ?
      displayLinks: {required: false, default: true, type: Boolean},
      displayEvents: {required: false, default: true, type: Boolean},
      displayDayNames: {required: false, default: true, type: Boolean}
    },
    components: {Task, Event},
    data () {
      const days = []
      // Building day names list
      for (let i = 1; i <= 7; i++) {
        days.push(moment().day(i).format('dddd'))
      }
      return {
        targetDate: this.$props.baseDay,
        today: moment(),
        grid: {},
        processing: true,
        days
      }
    },
    methods: {
      /**
       * Fills the grid for next month
       */
      nextMonth () {
        const newMonth = this.targetDate.month() + 1
        this.targetDate = this.targetDate.month(newMonth)
        this.fillGrid()
      },
      /**
       * Fills the grid for previous month
       */
      prevMonth () {
        const newMonth = this.targetDate.month() - 1
        this.targetDate = this.targetDate.month(newMonth)
        this.fillGrid()
      },
      fillGrid () {
        this.processing = true
        this.grid = {}
        const out = {}
        const year = this.targetDate.year()   // Year
        const month = this.targetDate.month() // This is the month, JS format (months starting at 0)
        // Creating current year/month in results
        out[year] = {}
        out[year][month] = {}

        // First day of month to display
        const day = moment([year, month, 1])

        // Fill the month
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
        if (this.$props.displayEvents) {
          for (const index in this.$props.events) {
            let eDate = null
            let e = this.$props.events[index]
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
        this.grid = out
      },
      targetNow () {
        this.targetDate = moment()
      },
      isToday (date) {
        date[2] = parseInt(date[2], 10) + 1
        return this.today.isSame(date, 'day')
      }
    },
    created () {
      this.fillGrid()
    }
  }
</script>
