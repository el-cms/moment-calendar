<template>
  <div class="mc-task">
    <span class="mc-task-description">{{data.title}}</span>
  </div>
</template>

<script>
  /**
   * Default task widget. You'd better start from this one to write your own
   */
  export default {
    name: 'calendar-widget-task',
    props: {
      /**
       * Task data
       */
      data: {required: true, type: Object, default: () => ({})}
    }
  }
</script>
