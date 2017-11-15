<template>
  <div class="mc-cal-view mc-cal-view--picker">

    <!-- Date -->
    <month-view :display-events="false"
                day-names-format="dd"
                class="mc-cal-view--month-small"
                @viewDay="setDay"
                :selected-day="final"></month-view>
    <!-- Time -->
    <div class="time">
      <div class="time_element hours">
        <button @click="change('hour', 1)">+</button>
        <input type="text" name="hours" :value="hour" v-model="hour">
        <button @click="change('hour', -1)">-</button>
      </div>
      <div class="time_element minutes">
        <button @click="change('minute', 1)">+</button>
        <input type="text" name="minutes" :value="minute" v-model="minute">
        <button @click="change('minute', -1)">-</button>
      </div>
      <div class="time_element seconds">
        <button @click="change('seconds', 1)">+</button>
        <input type="text" name="seconds" :value="seconds" v-model="seconds">
        <button @click="change('seconds', -1)">-</button>
      </div>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import MonthView from './view-month'

  export default {
    name: 'calendar-view-picker',
    components: {MonthView},
    props: {
      selectedDay: {required: false, default: () => moment(), type: Object}
    },
    data () {
      return {
        year: this.selectedDay.year(),
        month: this.selectedDay.month(),
        day: this.selectedDay.day(),
        hour: this.selectedDay.hour(),
        minute: this.selectedDay.minutes(),
        seconds: this.selectedDay.seconds(),
        final: this.selectedDay.clone()
      }
    },
    methods: {
      change (unit, amount) {
        this.final = this.final.add(amount, unit).clone()
        this.year = this.final.year()
        this.month = this.final.month()
        this.day = this.final.day()
        this.hour = this.final.hour()
        this.minute = this.final.minutes()
        this.seconds = this.final.seconds()
        this.$emit('selected', this.final)
      },
      setDay ({y, m, d}) {
        this.final = this.final.clone().year(y).month(m).date(parseInt(d, 10) + 1)
        this.$emit('selected', this.final)
      }
    }
  }
</script>
