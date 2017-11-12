<template>
  <div class="mc-event" :class="cssClass">{{data.title}} - d: {{duration}}h</div>
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
        return Math.round(d.endDate.diff(d.startDate) / 1000 / 60 / 60)
      },
      cssClass () {
        const d = this.duration
        const start = this.$props.data.startDate.hour()
        if (this.$props.data.fullDay) {
          return 'mc-event--full-day'
        }
        if (d + start > 24) {
          return `mc-event--${24 - start}h`
        } else if (d < 1) {
          return 'mc-event--1h'
        } else {
          return `mc-event--${d}h`
        }
      }
    }
  }
</script>
