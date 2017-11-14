<template>
  <div class="mc-cal-view mc-cal-view--week">

    <!-- Navigation links -->
    <div class="mc-cal-links" v-if="displayHeaders">
      <div class="link" v-if="displayLinks">
        <button @click="prevWeek()">&lt;</button>
      </div>
      <div class="link" v-if="displayLinks">
        <button @click="targetNow()">This week</button>
      </div>
      <!-- Header -->
      <div class="header">
        {{targetDate.startOf('week').format('YYYY-MM-DD')}} to
        {{targetDate.endOf('week').format('YYYY-MM-DD')}}
      </div>
      <!-- /Header -->

      <div class="link" v-if="displayLinks">
        <button @click="nextWeek()">&gt;</button>
      </div>
    </div>
    <!-- /Navigation links -->

    <!-- Days -->
    <div class="mc-days">
      <component :events="events"
                 :data="data"
                 header-format="dddd, DD"
                 :base-day="d"
                 :display-links="false"
                 :task-component="taskComponent"
                 :event-component="eventComponent"
                 :key="d.format('YYYY-MM-DD')"
                 :is="dayComponent"
                 v-for="d in grid"></component>
    </div>
    <!-- /Days -->

  </div>
</template>

<script>
  import moment from 'moment'
  import DayView from './view-day'

  /**
   * Displays events on a week.
   *
   * This component can also be used to display custom days. Read the following props
   * descriptions: `events`, `data`, `dayComponent`.
   */
  export default {
    name: 'calendar-view-week',
    components: {DayView},
    props: {
      /**
       * Event list
       */
      events: {required: false, type: Array, default: () => []},
      /**
       * Event lists, in a dictionary. Use this ONLY if you give a custom day-component
       * which accepts multiple lists of events (as `view-multiday`)
       */
      data: {required: false, type: Object, default: () => ({})},
      /**
       * First day to display when component is loaded.
       * Should be a moment object
       */
      baseDay: {required: false, default: () => moment(), type: Object}, // @todo How to check for a moment object ?
      /**
       * Flag to display or not the navigation links allowing to change the day
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
      taskComponent: {required: false, default: () => undefined, type: Object}, // @todo exact type ?
      /**
       * Alternative event component. Should be a Vue component object (not the name)
       **/
      eventComponent: {required: false, default: () => undefined, type: Object}, // @todo exact type ?
      /**
       * Alternative day component. Should be a Vue component object (not the name)
       * If you plan to use it for multiple lists of events, don't forget the `data` prop !
       */
      dayComponent: {required: false, default: () => DayView, type: Object} // @todo exact type ?
    },
    data () {
      return {
        // Day to display. Different from the prop, as the day can be changed from the component itself
        targetDate: this.$props.baseDay,
        // Today, only used to calculate the ruler position
        today: moment(),
        // List of days with their events
        grid: {}
      }
    },
    methods: {
      /**
       * Changes the current day and updates the grid
       * @public
       */
      nextWeek () {
        const newDay = this.targetDate.day() + 7
        this.targetDate = this.targetDate.day(newDay).clone()
        this.grid = this.fillGrid()
      },
      /**
       * Changes the current day and updates the grid
       * @public
       */
      prevWeek () {
        const newDay = this.targetDate.day() - 7
        this.targetDate = this.targetDate.day(newDay).clone()
        this.grid = this.fillGrid()
      },
      /**
       * Resets the date to today
       * @public
       */
      targetNow () {
        this.targetDate = moment().clone()
        this.grid = this.fillGrid()
      },
      /**
       * Creates the grid and prepares the events list
       * @public
       */
      fillGrid () {
        const baseDay = this.targetDate.clone().startOf('week')
        const out = []

        // Create the week
        for (var i = 0; i < 7; i++) {
          out.push(baseDay.add(1, 'day').clone())
        }

        return out
      }
    },
    created () {
      this.grid = this.fillGrid()
    },
    watch: {
      /**
       * Watch for events change in props
       */
      events () {
        this.grid = this.fillGrid()
      }
    }
  }
</script>
