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

<style>
.match-group-highlight-0 {
  background-color: #044;
}
.match-group-highlight-1 {
  background-color: #033;
}
</style>
