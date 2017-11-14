<template>
  <div class="mc-cal-view mc-cal-view--month">

    <div class="mc-cal-links" v-if="displayLinks">
      <div class="link">
        <button @click="prevMonth()">&lt;</button>
      </div>
      <div class="link">
        <button @click="targetNow()">Current month</button>
      </div>
      <div class="header">
        {{targetDate.format('YYYY, MMMM')}}
      </div>
      <div class="link">
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
  import Task from '../calendar-widget/widget-task'
  import Event from '../calendar-widget/widget-event'
  import MonthVieMixin from '../../mixins/mixin-month-views'

  export default {
    name: 'calendar-view-month',
    mixins: [MonthVieMixin],
    props: {
      events: {required: false, type: Array, default: () => []},
      baseDay: {required: false, default: () => moment()}, // @todo Type ?
      displayLinks: {required: false, default: true, type: Boolean},
      displayEvents: {required: false, default: true, type: Boolean},
      displayDayNames: {required: false, default: true, type: Boolean},
      taskComponent: {required: false, default: () => Task, type: Object}, // @todo exact type ?
      eventComponent: {required: false, default: () => Event, type: Object} // @todo exact type ?
    },
    components: {Task, Event},
    data () {
      const days = []
      // Building day names list
      for (let i = 1; i <= 7; i++) {
        days.push(moment().day(i).format('dddd'))
      }
      return {
        targetDate: this.$props.baseDay,
        today: moment(),
        grid: {},
        processing: false,
        days
      }
    },
    methods: {
      /**
       * Fills the grid for next month
       */
      nextMonth () {
        const newMonth = this.targetDate.month() + 1
        this.targetDate = this.targetDate.month(newMonth)
        this.grid = this.fillGrid(this.targetDate, this.events)
      },
      /**
       * Fills the grid for previous month
       */
      prevMonth () {
        const newMonth = this.targetDate.month() - 1
        this.targetDate = this.targetDate.month(newMonth)
        this.grid = this.fillGrid(this.targetDate, this.events)
      },
      targetNow () {
        this.targetDate = moment()
      },
      isToday (date) {
        date[2] = parseInt(date[2], 10) + 1
        return this.today.isSame(date, 'day')
      }
    },
    created () {
      this.grid = this.fillGrid(this.targetDate, this.events)
    },
    watch: {
      events () {
        this.grid = this.fillGrid(this.targetDate, this.events)
      }
    }
  }
</script>
