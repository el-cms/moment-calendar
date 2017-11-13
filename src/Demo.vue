<template>
  <div id="app">
    <ul>
      <li>
        <button @click="view = 'DayView'">Day</button>
      </li>
      <li>
        <button @click="view = 'WeekView'">Week</button>
      </li>
      <li>
        <button @click="view = 'MonthView'">Month</button>
      </li>
    </ul>

    <pre>
       Today: {{today}}
    Base day: {{refDay.format('YYYY-MM-DD')}}
      </pre>
    <component :is="view" :events="data" @viewDay="changeView" :baseDay="refDay"></component>
    <pre>{{data}}</pre>
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
