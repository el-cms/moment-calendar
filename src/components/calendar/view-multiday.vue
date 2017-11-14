<template>
  <div class="mc-cal-view mc-cal-view--multi-days">

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

    <!--Days -->
    <div class="mc-days">
      <day-widget :events="e"
                  :base-day="targetDate.clone()"
                  :display-links="false"
                  :task-component="eventComponent"
                  :event-component="eventComponent"
                  :header-Format="`[${index}]`"
                  :key="index"
                  v-for="e, index in data"></day-widget>
      <!--Days -->
    </div>
  </div>

</template>

<script>
  import moment from 'moment'
  import DayWidget from './view-day'

  /**
   * Displays the same day several times for different lists of events
   */
  export default {
    name: 'calendar-view-multiday',
    components: {DayWidget},
    props: {
      /**
       * Dictionary of event lists.
       * Should be formatted following the "Multiple event lists format".
       */
      data: {required: true, default: () => ({}), type: Object},
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
      taskComponent: {required: false, default: () => undefined, type: Object}, // @todo exact type ?
      /**
       * Alternative event component. Should be a Vue component object (not the name)
       **/
      eventComponent: {required: false, default: () => undefined, type: Object}, // @todo exact type ?
      /**
       * Format of the title. Refer to the [MomentJS docs](http://momentjs.com/docs/#/displaying/)
       * Use `"[brackets]"` to escape text.
       **/
      headerFormat: {required: false, default: 'dd, LL', type: String}
    },
    data () {
      return {
        // Day to display. Different from the prop, as the day can be changed from the component itself
        targetDate: this.$props.baseDay,
        // Today, only used to calculate the ruler position
        today: moment()
      }
    },
    methods: {
      /**
       * Changes the current day
       * @public
       */
      nextDay () {
        const newDay = this.targetDate.day() + 1
        this.targetDate = this.targetDate.day(newDay).clone()
      },
      /**
       * Changes the current day and updates the grid
       * @public
       */
      prevDay () {
        const newDay = this.targetDate.day() - 1
        this.targetDate = this.targetDate.day(newDay).clone()
      },
      /**
       * Resets the date to today
       * @public
       */
      targetNow () {
        this.targetDate = moment()
      }
    }
  }
</script>
