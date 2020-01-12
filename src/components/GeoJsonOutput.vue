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
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';

export default Vue.extend({
  name: 'GeoJsonOutput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    codeMirror: null as EditorFromTextArea|null,
  }),
  watch: {
    value(): void {
      if (this.codeMirror !== null) {
        this.codeMirror.setValue(this.value);
      }
    },
  },
  mounted(): void {
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
          readOnly: true,
          mode: 'application/json',
        },
      );
      this.codeMirror.setValue(this.value);

      const colorSchemeMediaQueryList = this.getColorSchemeMediaQueryList();
      this.initializeColorSchemeEventHandler(colorSchemeMediaQueryList);
      this.updateTheme(colorSchemeMediaQueryList);
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
}
</style>

<style>
.CodeMirror.cm-s-default {
  border-radius: 4px;
}
</style>
