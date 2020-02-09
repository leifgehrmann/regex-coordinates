<template>
  <div>
    <v-select
      :items="options"
      :menu-props="{ top: true, offsetY: true }"
      dense
      :value="value"
      @change="update"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface SelectOption {
  value: string|null;
  text: string;
}

export default Vue.extend({
  name: 'MatchGroupTypeSelect',
  props: {
    isWgs84: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    options(): SelectOption[] {
      if (this.isWgs84) {
        return [
          { value: null, text: '' },
          { value: 'x', text: 'Longitude (Decimal)' },
          { value: 'y', text: 'Latitude (Decimal)' },
          { value: 'name', text: 'Category name' },
          { value: 'time', text: 'Time' },
        ];
      }
      return [
        { value: null, text: '' },
        { value: 'x', text: 'X Coordinate' },
        { value: 'y', text: 'Y Coordinate' },
        { value: 'name', text: 'Category name' },
        { value: 'time', text: 'Time' },
      ];
    },
  },
  methods: {
    update(value: string): void {
      this.$emit('update:value', value);
    },
  },
});
</script>

<style scoped>
div {
  max-width: 270px;
}
</style>
