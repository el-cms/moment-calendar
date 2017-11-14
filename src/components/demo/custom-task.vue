<template>
  <div class="mc-task">
    CUSTOM - {{data.title}}
  </div>
</template>

<script>
  export default {
    name: 'custom-widget-task',
    props: {
      data: {required: true, type: Object, default: () => ({})}
    },
    data () {
      return {}
    }
  }
</script>
