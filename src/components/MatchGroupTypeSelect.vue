<template>
  <v-select
    :items="options"
    :menu-props="{ top: true, offsetY: true }"
    dense
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MatchGroupTypeSelect',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    options: [
      { value: null, text: '' },
      { value: 'longitude', text: 'Longitude (Decimal)' },
      { value: 'latitude', text: 'Latitude (Decimal)' },
      { value: 'name', text: 'Category name' },
      { value: 'time', text: 'Time' },
    ],
  }),
  methods: {
    update(value: string): void {
      this.$emit('update:value', value);
    },
  },
});
</script>
