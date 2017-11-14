<template>
  <div id="app" class="pas">
    <div class="grid has-gutter">
      <!-- Debug -->
      <div class="debug">
        <h1>
          VueJS calendar components based on
          <a href="https://http://momentjs.com" target="_blank">moment.js</a>
        </h1>
        <small>
          Version : Not even 0 &dash; <strong>No NPM package for now</strong>
        </small>
        <hr>
        Work in progress.
        <a href="https://github.com/el-cms/moment-calendar">Github</a>
        <a href="https://github.com/el-cms/moment-calendar/issues">Issues</a>
        <a href="http://vue2-mcalendar.experimentslabs.com/doc">Documentation</a>
        <hr>
        <div>
          <strong>View:</strong>
          <div class="links grid has-gutter">
            <a @click="displayView = 'dynamic'" :class="{active:displayView === 'dynamic'}">Dynamic</a>
            <a @click="displayView = 'month'" :class="{active:displayView === 'month'}">Month</a>
            <a @click="displayView = 'week'" :class="{active:displayView === 'week'}">Week</a>
            <a @click="displayView = 'day'" :class="{active:displayView === 'day'}">Day</a>
            <a @click="displayView = 'multiday'" :class="{active:displayView === 'multiday'}">X Day</a>
            <a @click="displayView = 'small'" :class="{active:displayView === 'small'}" disabled>Small</a>
            <a @click="displayView = 'small'" :class="{active:displayView === 'small'}" disabled>Combined</a>
            <a @click="displayView = 'picker'" :class="{active:displayView === 'picker'}" disabled>Picker</a>
          </div>
        </div>
        <div>
          <strong>Custom components:</strong>
          <div>
            <label for="cst-component">
              <input type="checkbox" :value="true" name="cst-component" id="cst-component"
                     v-model="useCustomComponents">
              Custom components
            </label>
          </div>
        </div>
      </div>
      <!-- /Debug -->

      <!-- Controls + form -->
      <div class="debug">
        <div class="grid has-gutter">
          <div>
            <strong>New event</strong>
            <!--<form @submit="addEvent()" id="evt-form">-->
            <label for="evt-title">Title</label>
            <input type="text" id="evt-title" name="evt-title" v-model="inputs.event.title">

            <label for="evt-startDate">Start date</label>
            <input type="datetime-local" id="evt-startDate" name="evt-startDate" v-model="inputs.event.startDate">

            <label for="evt-endDate">End date</label>
            <input type="datetime-local" id="evt-endDate" name="evt-endDate" v-model="inputs.event.endDate">

            <label for="evt-fullDay">
              <input type="checkbox" :value="true" name="evt-fullDay" id="evt-fullDay" v-model="inputs.event.fullDay">
              Full day
            </label>
            <br>
            <button @click="addEvent()">Add</button>
            <!--</form>-->
          </div>

          <div>
            <strong>New task</strong>
            <!--<form @submit="addTask()" id="tsk-form">-->
            <label for="tsk-title">Title</label>
            <input type="text" id="tsk-title" name="tsk-title" v-model="inputs.task.title">

            <label for="tsk-startDate">Due date</label>
            <input type="datetime-local" id="tsk-startDate" name="tsk-startDate" v-model="inputs.task.dueDate">

            <label for="tsk-done">
              <input type="checkbox" :value="true" name="tsk-done" id="tsk-done" v-model="inputs.task.done">
              Done
            </label>
            <br>
            <button @click="addTask()">Add</button>
            <!--</form>-->
          </div>

        </div>
      </div>
      <!-- /Controls + form -->
    </div>

    <!-- Sample data -->
    <div class="debug">
      <button @click="showDataset = !showDataset">{{showDataset ? 'Hide' : 'Show' }} dataset</button>
      <pre v-show="showDataset">{{data}}</pre>
    </div>

    <!-- Full calendar with reactive component -->
    <div class="demo-container" v-if="displayView === 'dynamic'">
      <div class="description">
        <code>components/calendar/view-dynamic.vue</code>
        <p>
          The view is loaded dynamically when clicking on the control buttons. Additionally, an
          event is fired when a day is clicked in the month view. The component is then changed
          when the event is catched.
        </p>
        <p>
          Use this "as is" or as an example to build your own dynamic calendar component.
        </p>
        <p>
          Note: there is no custom component used in this one.
        </p>
      </div>
      <!-- Actual calendar, called with a custom component so the views
           can be changed from here. -->
      <dynamic-view :events="data"
                    :baseDay="refDay"
      ></dynamic-view>
    </div>

    <!-- Month view only -->
    <div class="demo-container" v-if="displayView === 'month'">
      <div class="description">
        <code>components/calendar/view-month.vue</code>
      </div>
      <month-view :events="data" :baseDay="refDay"
                  :taskComponent="taskComponent"
                  :eventComponent="eventComponent"></month-view>
    </div>

    <!-- Week view only -->
    <div class="demo-container" v-if="displayView === 'week'">
      <div class="description">
        <code>components/calendar/view-week.vue</code>
      </div>
      <week-view :events="data" :baseDay="refDay"
                 :taskComponent="taskComponent"
                 :eventComponent="eventComponent"></week-view>
    </div>

    <!-- Day view only -->
    <div class="demo-container" v-if="displayView === 'day'">
      <div class="description">
        <code>components/calendar/view-day.vue</code>
      </div>
      <day-view :events="data" :baseDay="refDay"
                :taskComponent="taskComponent"
                :eventComponent="eventComponent"></day-view>
    </div>

    <!-- Multiple days only -->
    <div class="demo-container" v-if="displayView === 'multiday'">
      <div class="description">
        <code>components/calendar/view-multiday.vue</code>
      </div>
      <multiday-view :data="multidata"
                     :baseDay="refDay"
                     :taskComponent="taskComponent"
                     :eventComponent="eventComponent"></multiday-view>
    </div>

    <!-- Small calendar view -->
    <div class="demo-container" v-if="displayView === 'small'">
      <div class="description">
        <code>components/calendar/view-small.vue</code>
      </div>
    </div>
    <!-- Mixed calendar view -->
    <div class="demo-container" v-if="displayView === 'mixed'">
      <div class="description">
        <code>components/calendar/view-mixed.vue</code>
        <p>
          Use this "as is" or as an example to build your own dynamic calendar component.
        </p>
      </div>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  // Base components
  import DayView from './components/calendar/view-day'
  import MultidayView from './components/calendar/view-multiday'
  import MonthView from './components/calendar/view-month'
  import WeekView from './components/calendar/view-week'
  import DynamicView from './components/calendar/view-dynamic'
  // Custom elements
  import CustomTask from './components/demo/custom-task'
  import CustomEvent from './components/demo/custom-event'
  // Fake data
  import fake from './fakeApi'

  const randomChar = (size = 5) => Math.random().toString(36).substr(2, size)

  export default {
    name: 'app',
    components: {DayView, MultidayView, WeekView, MonthView, DynamicView, CustomTask, CustomEvent},
    data () {
      return {
        view: MonthView,
        data: fake.get(),
        multidata: fake.getMultiple(),
        refDay: moment(),
        today: moment(),
        inputs: {
          event: this.resetEvent(),
          task: this.resetTask()
        },
        displayView: 'dynamic',
        showDataset: false,
        useCustomComponents: false
      }
    },
    computed: {
      taskComponent () {
        return this.useCustomComponents ? CustomTask : undefined
      },
      eventComponent () {
        return this.useCustomComponents ? CustomEvent : undefined
      }
    },
    methods: {
      resetEvent () {
        return {
          title: 'Some fine event',
          startDate: moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment().add(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
          fullDay: false
        }
      },
      resetTask () {
        return {
          title: 'Some fine task',
          dueDate: moment().add(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
          done: false
        }
      },
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
      },
      addEvent () {
        const newEvent = {
          id: randomChar(),
          type: 'event',
          ...this.inputs.event
        }
        newEvent.startDate = moment(newEvent.startDate)
        newEvent.endDate = moment(newEvent.endDate)
        this.data.push(newEvent)
        this.inputs.event = this.resetEvent()
      },
      addTask () {
        const newTask = {
          id: randomChar(),
          type: 'task',
          ...this.inputs.task
        }
        newTask.dueDate = moment(newTask)
        this.data.push(newTask)
        this.inputs.task = this.resetTask()
      }
    },
    created () {
      this.$on('changeView', function (payload) {
        console.log(payload)
        this.logEvent('changeView', payload)
      })
    }
  }
</script>

<style lang="scss">
  @import "./stylesheets/app";
</style>
