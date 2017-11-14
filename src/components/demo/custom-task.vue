<template>
  <div class="mc-task">
    CUSTOM - {{data.title}}
  </div>
</template>

<script>
  /**
   * Example for a custom task widget
   */
  export default {
    name: 'custom-widget-task',
    props: {
      /**
       * Task data
       */
      data: {required: true, type: Object, default: () => ({})}
    }
  }
</script>
