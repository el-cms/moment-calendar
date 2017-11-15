<template>
  <div class="mc-cal-view mc-cal-view--day">
    <!-- Navigation links -->
    <div class="mc-cal-links" v-if="displayHeaders">
      <div class="link" v-if="displayLinks">
        <button @click="prevDay()">&lt;</button>
      </div>
      <div class="link" v-if="displayLinks">
        <button @click="targetNow()">Today</button>
      </div>
      <!-- Header -->
      <div class="header">
        {{targetDate.format(headerFormat)}}
      </div>
      <!-- /Header -->

      <div class="link" v-if="displayLinks">
        <button @click="nextDay()">&gt;</button>
      </div>
    </div>
    <!-- /Navigation links -->

    <template v-if="!processing">
      <!-- Full-day events -->
      <div class="mc-full-day-events" v-if="grid.fullDayEvents.length > 0">
        <div class="fullday">
          <component v-for="e, index in grid.fullDayEvents"
                     :data="e"
                     :key="index"
                     :is="e.type === 'event' ? eventComponent : taskComponent"></component>
        </div>
      </div>
      <!-- /Full-day events -->

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
                     :is="e.type === 'event' ? eventComponent : taskComponent"></component>
        </div>
      </div>
      <!-- /Hours -->
    </template>

    <div v-else>Loading...</div>

  </div>
</template>

<script>
  import moment from 'moment'
  import TaskWidget from '../calendar-widget/widget-task'
  import EventWidget from '../calendar-widget/widget-event'

  /**
   * Calendar : Day view
   *
   * Displays a one-day view with events and tasks
   */
  export default {
    name: 'calendar-view-day',
    components: {TaskWidget, EventWidget},
    props: {
      /**
       * Event list. Should be formatted following the "Event list format".
       */
      events: {required: false, type: Array, default: () => []},
      /**
       * First day to display when component is loaded.
       * Should be a moment object
       */
      baseDay: {required: false, default: () => moment(), type: Object}, // @todo How to check for a moment object ?
      /**
       * Flag to display or not the navigation links allowing to change the day.
       */
      displayLinks: {required: false, default: true, type: Boolean},
      /**
       * Flag to display the headers.
       * Headers are the buttons to change the day, and the view title.
       **/
      displayHeaders: {required: false, default: true, type: Boolean},
      /**
       * Alternative task component. Should be a Vue component object (not the name)
       **/
      taskComponent: {required: false, default: () => TaskWidget, type: Object}, // @todo exact type ?
      /**
       * Alternative event component. Should be a Vue component object (not the name)
       **/
      eventComponent: {required: false, default: () => EventWidget, type: Object}, // @todo exact type ?
      /**
       * Format of the title.
       * Refer to the [MomentJS docs](http://momentjs.com/docs/#/displaying/).
       * Use `"[brackets]"` to escape text.
       **/
      headerFormat: {required: false, default: 'dd, LL', type: String}
    },
    data () {
      return {
        // Day to display. Different from the prop, as the day can be changed from the component itself
        targetDate: this.$props.baseDay,
        // Today, only used to calculate the ruler position
        today: moment(),
        // List of hours with their events
        grid: {},
        // Set to true when grid is calculated
        processing: true,
        // Default ruler position
        rulerStyle: 'top:0'
      }
    },
    methods: {
      /**
       * Changes the current day and updates the grid
       * @public
       */
      nextDay () {
        const newDay = this.targetDate.day() + 1
        this.targetDate = this.targetDate.day(newDay)
        this.fillGrid()
      },
      /**
       * Changes the current day and updates the grid
       * @public
       */
      prevDay () {
        const newDay = this.targetDate.day() - 1
        this.targetDate = this.targetDate.day(newDay)
        this.fillGrid()
      },
      /**
       * Resets the date to today
       * @public
       */
      targetNow () {
        this.targetDate = moment()
        this.fillGrid()
      },
      /**
       * Creates the grid and prepares the events list. This should be called on props change
       * @public
       */
      fillGrid () {
        this.processing = true
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

        this.processing = false
        this.grid = out
      }
    },
    /**
     * Generates the grid and calculates the ruler position
     */
    created () {
      this.fillGrid()
      this.rulerStyle = `top:calc(50px * ${this.today.hour()})`
    },
    watch: {
      /**
       * Watches after the baseDay prop changes and recreates the grid.
       * @param {Moment} newDate - New date in prop
       */
      baseDay (newDate) {
        this.targetDate = newDate
        this.fillGrid()
      },
      /**
       * Watches after the events props changes and recreates the grid.
       */
      events () {
        this.fillGrid()
      }
    }
  }
</script>
