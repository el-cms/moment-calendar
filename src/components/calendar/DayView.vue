<template>
  <div class="cal-view--day">
    <div class="hours">
      <div>01h</div>
      <div>02h</div>
      <div>03h</div>
      <div>04h</div>
      <div>05h</div>
      <div>06h</div>
      <div>07h</div>
      <div>08h</div>
      <div>09h</div>
      <div>10h</div>
      <div>11h</div>
      <div>12h</div>
      <div>13h</div>
      <div>14h</div>
      <div>15h</div>
      <div>16h</div>
      <div>17h</div>
      <div>18h</div>
      <div>19h</div>
      <div>20h</div>
      <div>21h</div>
      <div>22h</div>
      <div>23h</div>
      <div>24h</div>
    </div>
    <div>
      <div :class="`cal-view--${e.type}`" v-for="e in events"></div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'calendar-day-view',
    props: { events: { required: false, default: [], type: array } },
    data() {
      return {}
    },
  }

</script>

<style scoped lang="scss">
  .cal-view {
    &--task {
      color: red;
    }
    &--event {
      color: blue;
    }
    &--day {
      display: flex;
      .hours {
        width: 50px;
        text-align: right;
      }
    }
  }
</style>
