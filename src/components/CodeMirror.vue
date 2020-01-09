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
import Parser from '@/utils/parser';

let codeMirror: EditorFromTextArea|null = null;
const textMarkers: CodeMirror.TextMarker[] = [];
const parser: Parser = new Parser();

function highlightMatches(value: string): void {
  textMarkers.forEach((textMarker) => {
    textMarker.clear();
  });
  if (codeMirror === null) {
    return;
  }
  const doc = codeMirror.getDoc();
  parser.parse2(value).forEach((regExpMatchArray, regExpMatchArrayIndex) => {
    if (codeMirror === null) {
      return;
    }
    const indexStart = regExpMatchArray.index;
    if (indexStart === undefined) {
      return;
    }
    const tokenLength = regExpMatchArray[0].length;
    const indexEnd = indexStart + tokenLength;

    const textMarker = codeMirror.markText(
      doc.posFromIndex(indexStart),
      doc.posFromIndex(indexEnd),
      {
        className: `match-group-highlight-${regExpMatchArrayIndex % 2}`,
      },
    );
    textMarkers.push(textMarker);
  });
}

export default Vue.extend({
  name: 'CodeMirror',
  props: {
    regexString: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    codeMirrorContent: '',
  }),
  watch: {
    regexString(): void {
      parser.setRegexFromString(this.regexString);
      highlightMatches(this.value);
    },
    value(): void {
      highlightMatches(this.value);
    },
  },
  mounted() {
    codeMirror = CodeMirror.fromTextArea(
      this.$refs.textarea as HTMLTextAreaElement,
      {
        value: `${this.value}`,
        lineNumbers: true,
        theme: 'material-darker',
      },
    );
    codeMirror.setValue(this.value);
    codeMirror.on('change', (instance) => {
      this.codeMirrorContent = instance.getValue();
      this.$emit('input', this.codeMirrorContent);
    });
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryList.addListener((event) => {
      if (codeMirror === null) {
        return;
      }
      const theme = event.matches ? 'material-darker' : 'default';
      codeMirror.setOption('theme', theme);
    });
    const theme = mediaQueryList.matches ? 'material-darker' : 'default';
    codeMirror.setOption('theme', theme);

    parser.setRegexFromString(this.regexString);
    highlightMatches(this.value);
  },
  destroyed() {
    const element = document.getElementById('code');
    if (element !== null) {
      element.remove();
    }
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
