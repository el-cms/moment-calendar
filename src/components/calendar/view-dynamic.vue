<template>
  <div>
    <!-- Navigation links to change the view -->
    <div v-if="displayLinks">
      View:
      <button @click="setView('month')">Month</button>
      <button @click="setView('week')">Week</button>
      <button @click="setView('day')">Day</button>
    </div>
    <!-- /Navigation links to change the view -->

    <!-- Component -->
    <component @viewDay="changeView"
               :base-day="baseDay"
               :events="events"
               :is="currentComponent"></component>

  </div>
</template>

<script>
  import moment from 'moment'
  import DayView from './view-day'
  import MonthView from './view-month'
  import WeekView from './view-week'

  /**
   * Full example of dynamic components: clicking on a day in month view will display the selected day.
   * This is not really meant to be used, but is more a source of inspiration for your own components.
   */
  export default {
    name: 'calendar-view-dynamic',
    components: {DayView, MonthView, WeekView},
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
       * Default view to show when the component is loaded.
       * Can be `month`, `day` or `week`.
       */
      defaultView: {required: false, default: 'month', type: String}
    },
    computed: {
      currentComponent () {
        return this.chooseComponent(this.view || this.$props.defaultView)
      }
    },
    data () {
      return {
        // Determines the current view
        view: this.$props.defaultView
      }
    },
    methods: {
      /**
       * Chooses a component to display, based on the `view` property.
       * @param   {String} view - The view
       * @returns {Object}      - A VueJS component
       * @public
       */
      chooseComponent (view) {
        switch (view) {
          case 'day':
            return DayView
          case 'month':
            return MonthView
          case 'week':
            return WeekView
          default:
            console.warn(`No valid view specified (${view})`)
        }
        return MonthView
      },
      /**
       * Changes the current view
       * @param {string} type - View type
       * @param {Moment} day  - Day to display
       *
       */
      changeView ({type, day}) {
        this.view = type
        this.refDay = moment(day)
        /**
         * View change event
         * @event changeView
         * @type {string}
         */
        this.$emit('changeView', type)
      },
      /**
       * Sets the current view from
       * @param view
       */
      setView (view) {
        this.view = view
        /**
         * View change event
         * @event changeView
         * @type {string}
         */
        this.$emit('changeView', view)
      }
    },
    watch: {
      /**
       * Events list watcher from props
       */
      events () {
        this.fillGrid()
      }
    }
  }
</script>
