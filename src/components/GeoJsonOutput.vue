<template>
  <v-textarea
      auto-grow
      name="geojson-output"
      label="GeoJSON Output"
      flat
      :value="value"
      readonly
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'GeoJsonOutput',
  props: ['value'],
});
</script>

<style>
  textarea {
    font-family: monospace !important;
  }
</style>
