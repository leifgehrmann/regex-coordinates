<template>
  <div>
    <code-mirror
      :value.sync="value2"
      :regex-string="regexString"
      @input="update2"
    />
    <div class="spacing" />
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
    regexString: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    value2: {
      type: String,
      default: '',
    },
  },
  methods: {
    update(value: string): void {
      this.$emit('update:value', value);
    },
    update2(value2: string): void {
      this.$emit('update:value2', value2);
    },
  },
});
</script>

<style>
  textarea {
    font-family: monospace !important;
  }
</style>

<style scoped>
  .spacing {
    margin-bottom: 20px;
  }
</style>
