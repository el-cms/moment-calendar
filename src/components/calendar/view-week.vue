<template>
  <div class="mc-cal-view mc-cal-view--week">

    <!-- Navigation links -->
    <div class="mc-cal-links" v-if="displayLinks">
      <div class="link">
        <button @click="prevWeek()">&lt;</button>
      </div>
      <div class="link">
        <button @click="targetNow()">This week</button>
      </div>
      <!-- Header -->
      <div class="header">
        {{targetDate.startOf('week').format('YYYY-MM-DD')}} to
        {{targetDate.endOf('week').format('YYYY-MM-DD')}}
      </div>
      <!-- /Header -->

      <div class="link">
        <button @click="nextWeek()">&gt;</button>
      </div>
    </div>
    <!-- /Navigation links -->

    <!-- Days -->
    <div class="mc-days">
      <day-view :events="events"
                headerFormat="dddd, DD"
                :baseDay="d"
                :displayLinks="false"
                :taskComponent="taskComponent"
                :eventComponent="eventComponent"
                :key="d.format('YYYY-MM-DD')"
                v-for="d in grid"></day-view>
    </div>
    <!-- /Days -->

  </div>
</template>

<script>
  import moment from 'moment'
  import DayView from './view-day'

  /**
   * Displays events on a week
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
       * First day to display when component is loaded.
       * Should be a moment object
       */
      baseDay: {required: false, default: () => moment(), type: Object}, // @todo How to check for a moment object ?
      /**
       * Flag to display or not the navigation links allowing to change the day
       *
       * Note: setting this to false will also remove the day name.
       */
      displayLinks: {required: false, default: true, type: Boolean},
      taskComponent: {required: false, default: () => undefined, type: Object}, // @todo exact type ?
      eventComponent: {required: false, default: () => undefined, type: Object}, // @todo exact type ?
      dayComponent: {required: false, default: () => DayView, type: Object} // @todo exact type ?
    },
    data () {
      return {
        targetDate: this.$props.baseDay,
        today: moment(),
        grid: {},
        processing: true
      }
    },
    methods: {
      /**
       * Changes the current day and updates the grid
       */
      nextWeek () {
        const newDay = this.targetDate.day() + 7
        this.targetDate = this.targetDate.day(newDay).clone()
        this.grid = this.fillGrid()
      },
      /**
       * Changes the current day and updates the grid
       */
      prevWeek () {
        const newDay = this.targetDate.day() - 7
        this.targetDate = this.targetDate.day(newDay).clone()
        this.grid = this.fillGrid()
      },
      targetNow () {
        this.targetDate = moment().clone()
        this.grid = this.fillGrid()
      },
      /**
       * Creates the grid and prepares the events list
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
      events () {
        this.grid = this.fillGrid()
      }
    }
  }
</script>
