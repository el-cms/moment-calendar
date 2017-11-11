<template>
  <div id="app">
    <component :is="view"></component>
  </div>
</template>

<script>
  import DayView from './components/calendar/DayView'
  import MonthView from './components/calendar/MonthView'
  import WeekView from './components/calendar/WeekView'

  export default {
    name: 'app',
    components: {
      DayView, WeekView, MonthView,
    },
    data() {
      return {
        view: DayView,
      }
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
