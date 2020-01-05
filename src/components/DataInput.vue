<template>
  <v-textarea
    name="data"
    auto-grow
    solo
    :value.sync="value"
    @input="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DataInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    update(value: string): void {
      this.$emit('update:value', value);
    },
  },
});
</script>

<style>
  textarea {
    font-family: monospace !important;
  }
</style>
