<template>
  <div class="cal-event" :class="cssClass">{{data.title}} - d: {{duration}}h</div>
</template>

<script>
  export default {
    name: 'calendar-widget-event',
    props: {
      data: {required: true, type: Object, default: () => ({})}
    },
    data () {
      return {}
    },
    computed: {
      duration () {
        const d = this.$props.data
        return d.endDate.diff(d.startDate) / 1000 / 60 / 60
      },
      cssClass () {
        const d = this.duration
        const start = this.$props.data.startDate.hour()
        if (this.$props.data.fullDay) {
          return 'cal-event--full-day'
        }
        if (d + start > 24) {
          return `cal-event--${24 - start}h`
        } else if (d < 1) {
          return 'cal-event--1h'
        } else {
          return `cal-event--${d}h`
        }
      }
    }
  }
</script>

<style lang="scss">
  .cal-event {
    font-size: .8em;
    background-color: #FFF;
    color: #2945ff;
    border: 0;
    box-shadow: 0 0 8px -2px rgba(77, 77, 77, .5);
    padding: .5em;
    border-left: 3px solid #2945ff;
    border-radius: 3px;
    &--full-day {
      border-left-color: #ffb85f;
      color: #ffb85f
    }
    &--1h {
      height: calc(50px - 1em);
    }
    &--2h {
      height: calc(2 * 50px - 1em);
    }
    &--3h {
      height: calc(3 * 50px - 1em);
    }
    &--14h {
      //height: calc(14 * (30px + 1em));
      height: calc(14 * 50px - 1em)
    }
  }
</style>
