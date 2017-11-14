<template>
  <div>
    <!-- Navigation links to change the view -->
    <div>
      View:
      <button @click="setView('month')">Month</button>
      <button @click="setView('week')" disabled>Week</button>
      <button @click="setView('day')">Day</button>
    </div>
    <!-- /Navigation links to change the view -->

    <!-- Component -->
    <component @viewDay="changeView" :baseDay="refDay" :events="events" :is="currentComponent"></component>

  </div>
</template>

<script>
  import moment from 'moment'
  import DayView from './view-day'
  import MonthView from './view-month'
  import WeekView from './view-week'

  export default {
    name: 'calendar-view-dynamic',
    components: {DayView, MonthView, WeekView},
    props: {
      events: {},
      baseDay: {},
      eventCmp: {},
      taskCmp: {},
      defaultView: 'month'
    },
    computed: {
      currentComponent () {
        return this.chooseComponent(this.view || this.$props.defaultView)
      }
    },
    data () {
      return {
        view: null,
        refDay: this.$props.baseDay
      }
    },
    methods: {
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
      changeView ({type, day}) {
        this.view = type
        this.refDay = moment(day)
      },
      setView (view) {
        this.view = view
        this.$emit('changeView', view)
      }
    },
    watch: {
      events () {
        console.log('event')
        this.fillGrid()
      }
    }
  }
</script>
