<template>
  <textarea id="code">
    Hello World!
  </textarea>
</template>

<script lang="ts">
import Vue from 'vue';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

export default Vue.extend({
  name: 'DataInput',
  mounted() {
    const codeMirror = CodeMirror.fromTextArea(
      document.getElementById('code') as HTMLTextAreaElement,
      {
        value: 'Hello World! 2.0',
        lineNumbers: true,
        mode: 'javascript',
      },
    );
    codeMirror.on('change', (instance) => {
      // eslint-disable-next-line no-console
      console.log(instance);
      this.$emit('change', 'Hello?');
    });
  },
});
</script>

<style scoped>

</style>
