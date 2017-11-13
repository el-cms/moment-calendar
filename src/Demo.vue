<template>
  <div id="app">
    <!-- Debug -->
    <div class="debug">
      <div>
        <h1>VueJS calendar components based on <a href="https://http://momentjs.com" target="_blank">moment.js</a></h1>
        <small><code>Version : Not even 0</code> &dash;
          Work in progress.
          <a href="https://github.com/el-cms/moment-calendar">Github</a>
          <a href="https://github.com/el-cms/moment-calendar/issues">Issues</a>
          <a href="http://vue2-mcalendar.experimentslabs.com/doc">Documentation</a>
          &dash; <strong>Not even a NPM package for now</strong>
        </small>
      </div>
      <hr>
      Display as :
      <button @click="view = 'DayView'">Day</button>
      <button @click="view = 'WeekView'">Week</button>
      <button @click="view = 'MonthView'">Month</button>
      <pre>
       Today: {{today}}
    Base day: {{refDay.format('YYYY-MM-DD')}}
      </pre>
    </div>
    <!-- /Debug -->

    <!-- Actual calendar, called with a custom component so the views
         can be changed from here. -->
    <component :is="view" :events="data" @viewDay="changeView" :baseDay="refDay"></component>

    <!-- Sample data -->
    <div class="debug">
      Dataset:
      <pre>{{data}}</pre>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import DayView from './components/calendar/view-day'
  import MonthView from './components/calendar/view-month'
  import WeekView from './components/calendar/view-week'

  import fake from './fakeApi'

  moment.locale('fr')

  export default {
    name: 'app',
    components: {
      DayView, WeekView, MonthView
    },
    data () {
      return {
        view: DayView,
        data: fake.get(),
        refDay: moment(),
        today: moment()
      }
    },
    methods: {
      changeView ({type, y, m, d}) {
        console.log(type, y, m, d)
        var view = null
        switch (type) {
          case 'day':
            view = DayView
            break
          case 'month':
            view = MonthView
            break
          case 'week':
            view = WeekView
            break
          default:
            console.log('Unknown view')
        }
        this.view = view
        if (y && m && d) {
          this.refDay = moment([y, m, d])
        } else {
          this.refDay = moment()
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "./stylesheets/app";
</style>
