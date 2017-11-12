<template>
  <div>
    Today: {{today}}
    <div style="display:flex; font-size:2em;">
      <button style="width:50px" @click="prevMonth()">&larr;</button>
      <div style="width:50px; text-align:center">NOW</div>
      <div style="flex-grow:2; text-align:center">Displayed month: {{targetDate.month() + 1}} - {{targetDate.year()}}
      </div>
      <button style="width:50px; text-align: right" @click="nextMonth()">&rarr;</button>
    </div>
    <div class="cal-view--month">

      <div class="day--names">
        <div class="day">Lundi</div>
        <div class="day">Mardi</div>
        <div class="day">Mercredi</div>
        <div class="day">Jeudi</div>
        <div class="day">Vendredi</div>
        <div class="day">Samedi</div>
        <div class="day">Dimanche</div>
      </div>

      <div class="days">
        <template v-for="y in grid" v-if="!processing">
          <template v-for="m, mIndex in y">
            <div v-for="d, index in m" class="day"
                 :class="{grayed: parseInt(targetDate.month(), 10) !== parseInt(mIndex,10) }">
              <div class="header" @click="$emit('viewday', {y, m, d})">{{parseInt(index, 10) + 1}}</div>
              <div class="events">
                <component v-for="e, index in d"
                           :data="e"
                           :key="index"
                           :is="e.type === 'event' ? 'Event' : 'Task'"></component>
              </div>
            </div>
          </template>
        </template>
        <div v-else>Préparation...</div>
      </div>

    </div>
    <pre>{{events}}</pre>
    <pre>{{grid}}</pre>
  </div>
</template>

<script>
  import moment from 'moment'
  import Task from '../calendar-widget/task'
  import Event from '../calendar-widget/event'
  import fakeApi from '../../fakeApi'

  export default {
    name: 'calendar-month-view',
    props: {
      events: {required: false, type: Array, default: () => []},
      baseDay: {required: false, default: () => moment()} // @todo Type ?
    },
    components: {Task, Event},
    data () {
      return {
        targetDate: this.$props.baseDay,
        today: moment().format('YYYY-MM-DD'),
        grid: {},
        processing: true
      }
    },
    computed: {
//      /**
//       * Returns the current year
//       * @returns {number}
//       */
//      year () {
//        return this.targetDate.year()
//      },
//      /**
//       * Returns the current month
//       * @returns {number}
//       */
//      month () {
//        return this.targetDate.month()
//      },
//      sortedEvents () {
//        return {}
////        const out = {}
////        const currentYear = this.currentDay.year()
////        const currentMonth = this.currentDay.month()
////        const currentDay = this.currentDay.date()
////
////        out.fullDay = []
////
////        for (let i = 0; i < 24; i++) {
////          out[currentYear][currentMonth][i] = []
////        }
////
////        // Sorting events
////        for (const e of this.$props.events) {
//////          console.group('checking event')
////          var date = null
////          if (e.dueDate) {
//////            console.log('task')
////            date = moment(e.dueDate)
////          } else if (e.startDate) {
//////            console.log('event')
////            date = moment(e.startDate)
////          } else {
//////            console.log('nothing')
////          }
////
//////          console.log(date.year() === currentYear, date.month() === currentMonth, date.date() === currentDay)
////
////          if (e.type === 'event' && e.fullDay) {
////            out.fullDay.push(e)
////          } else if (date &&
////            date.year() === currentYear &&
////            date.month() === currentMonth &&
////            date.date() === currentDay) {
////            console.log('Adding event')
//////            out[date.hour()].push(e)
////          }
//////          console.groupEnd()
////        }
//////        console.log(out)
////        return out
//      }
    },
    methods: {
      /**
       * Fills the grid for next month
       */
      nextMonth () {
        const newMonth = this.targetDate.month() + 1
        console.log('> Next month: ', newMonth)
        this.targetDate = this.targetDate.month(newMonth)
        this.fillGrid()
      },
      /**
       * Fills the grid for previous month
       */
      prevMonth () {
        const newMonth = this.targetDate.month() - 1
        console.log('> Prev month', newMonth)
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

        console.log(displayStartDate, displayEndDate)

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
            console.log(e.startDate.toString(), e.endDate.toString())
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
                      console.log(e.startDate.format('YYYY-MM-DD'))
                      if (moment([y, m, d]).hour(1).isBetween(startDay, endDay)) {
                        console.log('Found on ', d, e)
                        out[y][m][d].push(e)
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
      }
    },
    created () {
      this.fillGrid()
    }
  }
</script>

<style scoped lang="scss">
  .grayed {
    color: gray
  }

  .cal-view {
    &--month {
      border: 1px solid gray;
      border-collapse: collapse;
      .day--names {
        display: flex;
        width: 100%;
        .day {
          width: calc(100% / 7);
          text-align: center
        }
      }
      .days {
        display: flex;
        flex-wrap: wrap;
        .day {
          width: calc(100% / 7 - 1px);
          min-height: 8em;
          height: 8em;
          border: 1px solid lightgray;
          border-width: 0 0 1px 1px;
        }
      }
      /*.hour {*/
      /*display: flex;*/
      /*max-height: 50px;*/
      /*height: 50px;*/
      /*width: 100%;*/
      /*border-top: 1px solid lightgray;*/
      /*.hour-side {*/
      /*width: 50px;*/
      /*text-align: right;*/
      /*padding-right: .5em;*/
      /*border-right: 1px solid lightgray;*/
      /*margin-right: .5em;*/
      /*max-height: 3em;*/
      /*height: 3em;*/
      /*}*/
      /*.hour-content {*/
      /*flex-grow: 2;*/
      /*display: flex;*/
      /*width: 100%;*/
      /*& > div {*/
      /*//position:absolute;*/
      /*!*flex-grow: 2;*!*/
      /*}*/
      /*}*/
      /*}*/
    }
  }
</style>
