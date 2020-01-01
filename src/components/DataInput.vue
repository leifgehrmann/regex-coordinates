<template>
  <v-textarea
      name="data"
      label="Data"
      auto-grow
      solo
      :value.sync="value"
      v-on:input="update"/>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DataInput',
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
