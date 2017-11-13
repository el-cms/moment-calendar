<template>
  <div class="mc-cal-view mc-cal-view--day">
    <!-- Navigation links -->
    <div class="mc-cal-links" v-if="displayLinks">
      <div class="link">
        <button @click="prevDay()">&lt;</button>
      </div>
      <div class="link">
        <button @click="targetNow()">Today</button>
      </div>
      <div class="header">
        <span class="string">Displayed day:</span>
        {{targetDate.format('dd, LL')}}
      </div>
      <div class="link">
        <button @click="nextDay()">&gt;</button>
      </div>
    </div>


    <!-- Full-day events -->
    <div class="mc-full-day-events" v-if="grid.fullDayEvents.length > 0">
      <div class="fullday">
        <component v-for="e, index in grid.fullDayEvents"
                   :data="e"
                   :key="index"
                   :is="e.type === 'event' ? 'Event' : 'Task'"></component>
      </div>
    </div>

    <!-- Time ruler -->
    <div class="ruler" :style="rulerStyle"></div>

    <!-- Hours -->
    <div class="mc-hour-line" v-for="events, h in grid.events">
      <!-- Hour text -->
      <div class="hour">{{h}}h</div>
      <!-- Events -->
      <div class="content">
        <component v-for="e, index in events"
                   :data="e"
                   :key="index"
                   :is="e.type === 'event' ? 'Event' : 'Task'"></component>
      </div>
    </div>

    <pre>{{grid}}</pre>
  </div>
</template>

<script>
  import moment from 'moment'
  import Task from '../calendar-widget/widget-task'
  import Event from '../calendar-widget/widget-event'

  export default {
    name: 'calendar-view-day',
    props: {
      events: {required: false, type: Array, default: () => []},
      baseDay: {required: false, default: () => moment()}, // @todo Type ?
      displayLinks: {required: false, default: true, type: Boolean}
    },
    components: {Task, Event},
    data () {
      return {
        targetDate: this.$props.baseDay,
        today: moment(),
        grid: {},
        processing: true,
        rulerStyle: 'top:0'
      }
    },
    methods: {
      /**
       * Fills the grid for next day
       */
      nextDay () {
        const newDay = this.targetDate.day() + 1
        this.targetDate = this.targetDate.day(newDay)
        this.fillGrid()
      },
      /**
       * Fills the grid for previous day
       */
      prevDay () {
        const newDay = this.targetDate.day() - 1
        this.targetDate = this.targetDate.day(newDay)
        this.fillGrid()
      },
      fillGrid () {
        const baseDay = this.$props.baseDay
        const out = {}
        var displayStartDate = baseDay.clone().startOf('day')
        var displayEndDate = baseDay.clone().endOf('day')

        // Prepare the output
        out.fullDayEvents = []
        out.events = {}

        for (let i = 0; i < 24; i++) {
          out.events[i] = []
        }

        // Sorting events
        for (const e of this.$props.events) { // Task
          if (
            e.dueDate &&
            e.dueDate.isBetween(displayStartDate, displayEndDate)
          ) {
            out.events[e.dueDate.hour()].push(e)
          } else if ( // Event

          e.type === 'event' &&
          (
            // End or beginning is today
            (
              e.startDate.isBetween(displayStartDate, displayEndDate) ||
              e.endDate.isBetween(displayStartDate, displayEndDate)
            ) ||
            // Today is in range
            (
              this.targetDate.isBetween(e.startDate, e.endDate)
            )
          )
          ) {
            if (e.fullDay) { // Full-day event
              out.fullDayEvents.push(e)
            } else {         // Regular event
              // Copy to avoid issues with changed dates
              // @todo this, but better
              const newEvent = JSON.parse(JSON.stringify(e))
              newEvent.startDate = moment(newEvent.startDate)
              newEvent.endDate = moment(newEvent.endDate)
              // Check for start date...
              if (newEvent.startDate.format('YYYY-MM-DD') !== this.targetDate.format('YYYY-MM-DD')) {
                newEvent.startDate = displayStartDate.clone()
              }

              if (newEvent.endDate.format('YYYY-MM-DD') !== this.targetDate.format('YYYY-MM-DD')) {
                newEvent.endDate = displayEndDate.clone()
              }

              out.events[newEvent.startDate.hour()].push(newEvent)
            }
          }
        }
        this.grid = out
      }
    },
    created () {
      this.fillGrid()
      this.rulerStyle = `top:calc(50px * ${this.today.hour()})`
    }
  }
</script>
