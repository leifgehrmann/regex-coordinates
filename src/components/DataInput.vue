<template>
  <div>
    <code-mirror />
    <v-textarea
      name="data"
      auto-grow
      solo
      :value.sync="value"
      @input="update"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CodeMirror from '@/components/CodeMirror.vue';

export default Vue.extend({
  name: 'DataInput',
  components: {
    CodeMirror,
  },
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
