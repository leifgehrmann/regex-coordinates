<template>
  <div>
    <div class="codemirror-container">
      <textarea
        ref="textarea"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CodeMirror, { EditorFromTextArea } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import Parser from '@/utils/parser';

export default Vue.extend({
  name: 'DataInput',
  props: {
    regexString: {
      type: String,
      default: '',
    },
    regexFlagsString: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    codeMirror: null as EditorFromTextArea|null,
    textMarkers: [] as CodeMirror.TextMarker[],
    parser: new Parser(),
    maxMarkers: 50,
  }),
  watch: {
    regexString(): void {
      this.updateRegexParser();
      this.updateHighlightMatches();
    },
    regexFlagsString(): void {
      this.updateRegexParser();
      this.updateHighlightMatches();
    },
    value(): void {
      // If the input field is in focus, do not update, otherwise
      // the cursor will be sent to the very beginning!
      if (this.codeMirror !== null && !this.codeMirror.hasFocus()) {
        this.codeMirror.setValue(this.value);
      }
      this.updateHighlightMatches();
    },
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize(): void {
      this.codeMirror = CodeMirror.fromTextArea(
        this.$refs.textarea as HTMLTextAreaElement,
        {
          value: `${this.value}`,
          lineNumbers: true,
          theme: 'default',
          mode: 'none',
        },
      );
      this.codeMirror.setValue(this.value);
      this.initializeChangeEventHandler();

      const colorSchemeMediaQueryList = this.getColorSchemeMediaQueryList();
      this.initializeColorSchemeEventHandler(colorSchemeMediaQueryList);
      this.updateTheme(colorSchemeMediaQueryList);

      this.updateRegexParser();
      this.updateHighlightMatches();
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
    updateRegexParser(): void {
      this.parser.setRegexFromString(this.regexString, this.regexFlagsString);
    },
    clearHighlightMatches(): void {
      this.textMarkers.forEach((textMarker) => {
        textMarker.clear();
      });
      this.textMarkers = [];
    },
    updateHighlightMatches(): void {
      this.clearHighlightMatches();
      if (this.codeMirror === null) {
        return;
      }
      const doc = this.codeMirror.getDoc();
      const regExpMatchArrays = this.parser.parseFiniteMatches(this.value, this.maxMarkers);
      // Use .every to skip iterating through all results of the array.
      regExpMatchArrays.every((regExpMatchArray, regExpMatchArrayIndex) => {
        if (this.codeMirror === null) {
          return false;
        }
        if (regExpMatchArrayIndex > this.maxMarkers) {
          return false;
        }
        const indexStart = regExpMatchArray.index;
        if (indexStart === undefined) {
          return false;
        }
        const tokenLength = regExpMatchArray[0].length;
        const indexEnd = indexStart + tokenLength;

        const textMarker = this.codeMirror.markText(
          doc.posFromIndex(indexStart),
          doc.posFromIndex(indexEnd),
          {
            className: `match-group-highlight-${regExpMatchArrayIndex % 2}`,
          },
        );
        this.textMarkers.push(textMarker);
        return true;
      });
    },
  },
});
</script>

<style scoped>
.codemirror-container {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
  0 2px 2px 0 rgba(0, 0, 0, 0.14),
  0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
</style>

<style>
.CodeMirror.cm-s-default {
  border-radius: 4px;
  height: auto;
  max-height: 50vh;
}

.CodeMirror-scroll {
  height: auto;
  max-height: 50vh;
}

.match-group-highlight-0 {
  background-color: rgba(116,196,255,1);
}
.match-group-highlight-1 {
  background-color: rgba(198,227,255,1);
}

@media (prefers-color-scheme: dark) {
  .match-group-highlight-0 {
    background-color: rgba(5, 51, 93, 1);
  }

  .match-group-highlight-1 {
    background-color: rgba(8, 75, 140, 1);
  }
}
</style>
