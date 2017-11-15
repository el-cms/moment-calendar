<template>
  <div class="mc-event mc-event-custom" :class="cssClass">{{data.title}} - d: {{duration}}h</div>
</template>

<script>
  /**
   * Example for a custom event widget
   */
  export default {
    name: 'custom-widget-event',
    props: {
      /**
       * Event data
       */
      data: {required: true, type: Object, default: () => ({})}
    },
    computed: {
      /**
       * Event duration, in hours
       * @returns {number}
       */
      duration () {
        const d = this.$props.data
        return Math.round(d.endDate.diff(d.startDate) / 1000 / 60 / 60)
      },
      /**
       * Determines the css class, based on the event length
       * @returns {String}
       */
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
