<template>
  <div>
    <textarea
      ref="textarea"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CodeMirror, { EditorFromTextArea } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';

export default Vue.extend({
  name: 'RegexInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    codeMirror: null as EditorFromTextArea|null,
  }),
  mounted() {
    this.initialize();
  },
  methods: {
    initialize(): void {
      this.codeMirror = CodeMirror.fromTextArea(
        this.$refs.textarea as HTMLTextAreaElement,
        {
          value: `${this.value}`,
          lineNumbers: false,
          theme: 'default',
        },
      );
      this.codeMirror.setValue(this.value);
      this.initializeChangeEventHandler();

      const colorSchemeMediaQueryList = this.getColorSchemeMediaQueryList();
      this.initializeColorSchemeEventHandler(colorSchemeMediaQueryList);
      this.updateTheme(colorSchemeMediaQueryList);
    },
    initializeChangeEventHandler(): void {
      if (this.codeMirror === null) {
        return;
      }
      this.codeMirror.on('change', (instance) => {
        this.$emit('update:value', instance.getValue());
      });
    },
    initializeColorSchemeEventHandler(mediaQueryList: MediaQueryList): void {
      mediaQueryList.addListener((mediaQueryListEvent) => {
        this.updateTheme(mediaQueryListEvent);
      });
    },
    updateTheme(mediaQueryList: MediaQueryList | MediaQueryListEvent): void {
      const theme = mediaQueryList.matches ? 'material-darker' : 'default';
      if (this.codeMirror !== null) {
        this.codeMirror.setOption('theme', theme);
      }
    },
    getColorSchemeMediaQueryList(): MediaQueryList {
      return window.matchMedia('(prefers-color-scheme: dark)');
    },
  },
});
</script>

<style scoped>
div {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
  0 2px 2px 0 rgba(0, 0, 0, 0.14),
  0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 4px;
  background: #FFFFFF;
}

@media (prefers-color-scheme: dark) {
  div {
    background: #212121;
  }
}
</style>

<style>
.CodeMirror {
  height: auto;
}

textarea {
  font-family: monospace !important;
}
</style>
