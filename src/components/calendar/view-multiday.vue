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
                  :baseDay="targetDate.clone()"
                  :displayLinks="false"
                  :taskComponent="eventComponent"
                  :eventComponent="eventComponent"
                  :headerFormat="`[${index}]`"
                  :key="index"
                  v-for="e, index in data"></day-widget>
      <!--Days -->
    </div>
  </div>

</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'
  import DayWidget from './view-day'

  export default {
    name: 'calendar-view-multiday',
    components: {DayWidget},
    props: {
      data: {required: true, default: () => {}, type: Object},
      /**
       * First day to display when component is loaded.
       * Should be a moment object
       */
      baseDay: {required: false, default: () => moment(), type: Object}, // @todo How to check for a moment object ?
      displayLinks: {required: false, default: true, type: Boolean},
      displayHeaders: {required: false, default: true, type: Boolean},
      taskComponent: {required: false, default: () => undefined, type: Object}, // @todo exact type ?
      eventComponent: {required: false, default: () => undefined, type: Object}, // @todo exact type ?
      headerFormat: {required: false, default: 'dd, LL', type: String}
    },
    data () {
      return {
        targetDate: this.$props.baseDay,
        today: moment(),
        grid: {},
        processing: true,
        rulerStyle: 'top:0'
      }
    },
    methods: {
      /**
       * Changes the current day and updates the grid
       */
      nextDay () {
        const newDay = this.targetDate.day() + 1
        Vue.set(this.targetDate = this.targetDate.day(newDay).clone())
      },
      /**
       * Changes the current day and updates the grid
       */
      prevDay () {
        const newDay = this.targetDate.day() - 1
//        this.targetDate = this.targetDate.day(newDay)
        Vue.set(this.targetDate = this.targetDate.day(newDay).clone())
      },
      targetNow () {
        this.targetDate = moment()
      }
    }
  }
</script>
