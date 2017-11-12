<template>
  <div class="cal-task">
    <div class="icon">&check;</div> {{data.title}}
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

<style lang="scss">
  .cal-task{
    color: gray;
    .icon {
      background-color: #ff6a6b;
      line-height: 1em;
      border-radius: 50%;
      padding: 0.3em;
      text-align: center;
      display: inline-block;
      width: 16px;
      border:3px solid #eee;
      color: white;
    }
  }
</style>
