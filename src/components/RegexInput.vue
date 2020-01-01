<template>
  <v-textarea
      auto-grow
      solo
      name="regex"
      label="Regex"
      rows="1"
      :value.sync="value"
      v-on:input="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'RegexInput',
  props: ['value'],
  methods: {
    update(value: any) {
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
