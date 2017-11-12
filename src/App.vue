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
    <component :is="view" :events="data"></component>
    <pre>{{data}}</pre>
  </div>
</template>

<script>
  import DayView from './components/calendar/DayView'
  import MonthView from './components/calendar/MonthView'
  import WeekView from './components/calendar/WeekView'

  import fake from './fakeApi'

  export default {
    name: 'app',
    components: {
      DayView, WeekView, MonthView
    },
    data () {
      return {
        view: DayView,
        data: fake.get()
      }
    }
  }
</script>

<style>
  body {
    font-family: sans-serif;
    box-sizing: border-box;
  }
</style>
