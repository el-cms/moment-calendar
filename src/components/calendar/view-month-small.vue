<template>
  <month-view :display-events="false"
              day-names-format="dd"
              @viewDay="viewDay"
              :selectedDay="selectedDay"
              class="mc-cal-view--month-small"></month-view>
</template>

<script>
  import moment from 'moment'
  import MonthView from './view-month'

  export default {
    name: 'calendar-view-month-small',
    components: {MonthView},
    props: {
      selectedDay: {required: false, default: () => moment(), type: Object}
    },
    methods: {
      viewDay (d) {
        this.$emit('viewDay', d)
      }
    }
  }
</script>
