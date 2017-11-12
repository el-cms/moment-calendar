<template>
  <div class="mc-task">
    <span class="mc-task-description">{{data.title}}</span>
  </div>
</template>

<script>
  export default {
    name: 'calendar-widget-task',
    props: {
      data: {required: true, type: Object, default: () => ({})}
    },
    data () {
      return {}
    }
  }
</script>
