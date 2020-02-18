<template>
  <div>
    <div class="feature-type">
      <input
        id="points"
        type="radio"
        value="points"
      >
      <label for="points">Points</label><br>
      <input
        id="both"
        type="radio"
        value="both"
      >
      <label for="both">Both</label><br>
      <input
        id="linestring"
        type="radio"
        value="linestring"
      >
      <label for="linestring">Linestring</label>
    </div>
    <div class="group-by">
      <label for="group-by">Group by:</label>
      <select id="group-by">
        <option>something</option>
      </select>
    </div>
    <div class="order-by">
      <label for="order-by">Order by:</label>
      <select id="order-by">
        <option>test</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'OutputSettings',
  props: {
    allGroupSettings: {
      type: String,
      default: (): string => '',
    },
    // feature-type
    // group-by
    // order-by
  },
  watch: {
    $props: {
      deep: true,
      handler(): void {
        console.log('Something changes with the allGroupSettings');
      },
    },
  },
});
</script>

<style scoped>


@media (prefers-color-scheme: dark) {

}

</style>
