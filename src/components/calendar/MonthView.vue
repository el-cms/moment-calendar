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

    <div class="mc-headers">
      <div class="day" v-for="d in days">{{d}}</div>
    </div>

    <div class="mc-days">
      <template v-for="y, yIndex in grid" v-if="!processing">
        <template v-for="m, mIndex in y">
          <div v-for="d, index in m" class="day"
               :class="{'out-of-scope': parseInt(targetDate.month(), 10) !== parseInt(mIndex,10) }">
            <a class="header" href="#" @click="$emit('viewDay', {type:'day', y:yIndex, m:mIndex, d:index})">
              {{parseInt(index, 10) + 1}}
            </a>
            <div class="events">
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
    <!--<pre>{{events}}</pre>-->
    <!--<pre>{{grid}}</pre>-->
  </div>
</template>

<script>
  import moment from 'moment'
  import Task from '../calendar-widget/task'
  import Event from '../calendar-widget/event'

  export default {
    name: 'calendar-month-view',
    props: {
      events: {required: false, type: Array, default: () => []},
      baseDay: {required: false, default: () => moment()}, // @todo Type ?
      displayLinks: {required: false, default: true, type: Boolean}
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
        today: moment().format('YYYY-MM-DD'),
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
//        console.log('> Next month: ', newMonth)
        this.targetDate = this.targetDate.month(newMonth)
        this.fillGrid()
      },
      /**
       * Fills the grid for previous month
       */
      prevMonth () {
        const newMonth = this.targetDate.month() - 1
//        console.log('> Prev month', newMonth)
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

        console.group(`Creating the grid for ${month}-${year}`)

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

          // Change of the start date
//          displayStartDate = displayStartDate.subtract(`${dayInWeek - 1}d`)
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
          // Change the end date
//          displayEndDate = displayEndDate.add(`${nextMonthDelta}d`)
        }

//        console.log(displayStartDate, displayEndDate)

        // Adding events
        const years = Object.keys(out)
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
            out[eDate.year()][eDate.month()][eDate.date()].push(e)
          } else if (
            e.type === 'event' &&
            e.startDate &&
            e.endDate &&
            (
              e.startDate.isBetween(displayStartDate, displayEndDate) ||
              e.endDate.isBetween(displayStartDate, displayEndDate)
            )
          ) {
//            console.log(e.startDate.toString(), e.endDate.toString())
            // Find days concerned by this event
            // @todo this, but better
            const startDay = e.startDate.clone().startOf('day')
            const endDay = e.endDate.clone().endOf('day')
            for (const y in out) {
              if (e.startDate.year() == y || e.endDate.year() == y) {
                for (const m in out[y]) {
                  if (e.startDate.month() == m || e.endDate.month() == m) {
                    // Days
                    for (const d in out[y][m]) {
//                      console.log(e.startDate.format('YYYY-MM-DD'))
                      if (moment([y, m, d]).hour(1).isBetween(startDay, endDay)) {
//                        console.log('Found on ', d, e)
                        out[y][m][d - 1].push(e)
                      }
                    }
                  }
                }
              }
            }
          }
        }

        console.groupEnd()
        this.processing = false
        this.grid = out
      },
      targetNow () {
        this.targetDate = moment()
      }
    },
    created () {
      this.fillGrid()
    }
  }
</script>
