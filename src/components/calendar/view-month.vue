<template>
  <div class="mc-cal-view mc-cal-view--month">

    <div class="mc-cal-links" v-if="displayHeaders">
      <div class="link" v-if="displayLinks">
        <button @click="prevMonth()">&lt;</button>
      </div>
      <div class="link" v-if="displayLinks">
        <button @click="targetNow()">Current month</button>
      </div>
      <div class="header">
        {{targetDate.format('YYYY, MMMM')}}
      </div>
      <div class="link" v-if="displayLinks">
        <button @click="nextMonth()">&gt;</button>
      </div>
    </div>

    <div class="mc-headers" v-if="displayDayNames">
      <div class="day" v-for="d in days">{{d}}</div>
    </div>

    <div class="mc-days">
      <template v-for="y, yIndex in grid" v-if="!processing">
        <template v-for="m, mIndex in y">
          <div v-for="d, index in m" class="day"
               :class="{
            'out-of-scope': parseInt(targetDate.month(), 10) !== parseInt(mIndex,10),
            'current-day' : isToday([yIndex, mIndex, index])
                }">
            <a class="header" href="#" @click="$emit('viewDay', {type:'day', y:yIndex, m:mIndex, d:index})">
              {{parseInt(index, 10) + 1}}
            </a>
            <div class="events" v-if="displayEvents">
              <component v-for="e, index in d"
                         :data="e"
                         :key="index"
                         :is="e.type === 'event' ? $props.eventComponent : taskComponent"></component>
            </div>
          </div>
        </template>
      </template>

      <div v-else>Loading...</div>

    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import TaskWidget from '../calendar-widget/widget-task'
  import EventWidget from '../calendar-widget/widget-event'
  import MonthViewMixin from '../../mixins/mixin-month-views'

  /**
   * Calendar: Month view
   *
   * Monthly view; can be used with or without events.
   */
  export default {
    name: 'calendar-view-month',
    mixins: [MonthViewMixin],
    components: {Task: TaskWidget, Event: EventWidget},
    props: {
      /**
       * Event list. Should be formatted following the "Event list format".
       */
      events: {required: false, type: Array, default: () => []},
      /**
       * First day to display when component is loaded.
       * Should be a moment object
       */
      baseDay: {required: false, default: () => moment()}, // @todo Type ?
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
       * Flag to display the events or not
       */
      displayEvents: {required: false, default: true, type: Boolean},
      /**
       * Flag to display the day names as column headers
       */
      displayDayNames: {required: false, default: true, type: Boolean},
      /**
       * Alternative task component. Should be a Vue component object (not the name)
       **/
      taskComponent: {required: false, default: () => TaskWidget, type: Object}, // @todo exact type ?
      /**
       * Alternative event component. Should be a Vue component object (not the name)
       **/
      eventComponent: {required: false, default: () => EventWidget, type: Object} // @todo exact type ?
    },
    data () {
      const days = []
      // Building day names list
      for (let i = 1; i <= 7; i++) {
        days.push(moment().day(i).format('dddd'))
      }
      return {
        // Day to display. Different from the prop, as the day can be changed from the component itself
        targetDate: this.$props.baseDay,
        // Today, only used to calculate the ruler position
        today: moment(),
        // List of hours with their events
        grid: {},
        // Set to true when grid is calculated
        processing: true,
        // List of day names from Monday to Sunday
        days
      }
    },
    methods: {
      /**
       * Fills the grid for next month
       * @public
       */
      nextMonth () {
        const newMonth = this.targetDate.month() + 1
        this.targetDate = this.targetDate.month(newMonth).clone()
        this.grid = this.fillGrid(this.targetDate, this.events)
      },
      /**
       * Fills the grid for previous month
       * @public
       */
      prevMonth () {
        const newMonth = this.targetDate.month() - 1
        this.targetDate = this.targetDate.month(newMonth).clone()
        this.grid = this.fillGrid(this.targetDate, this.events)
      },
      /**
       * Changes the base day to today (so, current month)
       * @public
       */
      targetNow () {
        this.targetDate = moment().clone()
        this.grid = this.fillGrid(this.targetDate, this.events)
      },
      /**
       * Checks if a date is today
       * @param {Moment} date - Date to test
       * @returns {boolean}
       * @public
       */
      isToday (date) {
        date[2] = parseInt(date[2], 10) + 1
        return this.today.isSame(date, 'day')
      }
    },
    created () {
      this.grid = this.fillGrid(this.targetDate, this.events)
    },
    watch: {
      /**
       * Watches the events prop changes and rebuilds the grid.
       */
      events () {
        this.grid = this.fillGrid(this.targetDate, this.events)
      }
    }
  }
</script>
