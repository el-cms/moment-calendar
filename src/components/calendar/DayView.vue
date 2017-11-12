<template>
  <div>
    day: {{day}}
    <div class="cal-view--day">
      <div class="fullday">
        <component v-for="e, index in sortedEvents.fullDay"
                   :data="e"
                   :key="index"
                   :is="e.type === 'event' ? 'Event' : 'Task'"></component>
      </div>
      <div class="hour" v-for="h in hours">
        <div class="hour-side">{{h}}h</div>
        <div class="hour-content">
          <component v-for="e, index in sortedEvents[h]"
                     :data="e"
                     :key="index"
                     :is="e.type === 'event' ? 'Event' : 'Task'"></component>
        </div>
      </div>
      <div :class="`cal-view--${e.type}`" v-for="e in events">{{e.title}}</div>
    </div>
    <pre>{{sortedEvents}}</pre>
  </div>
</template>

<script>
  import moment from 'moment'
  import Task from '../calendar-widget/task'
  import Event from '../calendar-widget/event'

  export default {
    name: 'calendar-day-view',
    props: {
      events: {required: false, type: Array, default: () => []},
      day: {required: false, default: () => moment()} // @todo Type ?
    },
    components: {Task, Event},
    data () {
      return {
        hours: [...Array(24)].map((x, i) => i)
      }
    },
    computed: {
      currentDay () {
        return moment(this.$props.day)
      },
      sortedEvents () {
        const out = {}
        const currentYear = this.currentDay.year()
        const currentMonth = this.currentDay.month()
        const currentDay = this.currentDay.date()

        out.fullDay = []

        for (let i = 0; i < 24; i++) {
          out[i] = []
        }

        // Sorting events
        for (const e of this.$props.events) {
//          console.group('checking event')
          var date = null
          if (e.dueDate) {
//            console.log('task')
            date = moment(e.dueDate)
          } else if (e.startDate) {
//            console.log('event')
            date = moment(e.startDate)
          } else {
//            console.log('nothing')
          }

//          console.log(date.year() === currentYear, date.month() === currentMonth, date.date() === currentDay)

          if (e.type === 'event' && e.fullDay) {
            out.fullDay.push(e)
          } else if (date &&
            date.year() === currentYear &&
            date.month() === currentMonth &&
            date.date() === currentDay) {
//            console.log('Adding event')
            out[date.hour()].push(e)
          }
//          console.groupEnd()
        }
//        console.log(out)
        return out
      }
    }
  }
</script>

<style scoped lang="scss">
  .cal-view {
    &--day {
      .hour {
        display: flex;
        max-height: 50px;
        height: 50px;
        width: 100%;
        border-top: 1px solid lightgray;
        .hour-side {
          width: 50px;
          text-align: right;
          padding-right: .5em;
          border-right: 1px solid lightgray;
          margin-right: .5em;
          max-height: 3em;
          height: 3em;
        }
        .hour-content {
          flex-grow: 2;
          display: flex;
          width:100%;
          & > div {
            //position:absolute;
            /*flex-grow: 2;*/
          }
        }
      }
    }
  }
</style>
