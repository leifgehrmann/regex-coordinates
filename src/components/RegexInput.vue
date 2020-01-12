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
import { debounce } from 'debounce';
import regExpParser from '@/utils/regExpParser';
import RegExpToken from '@/utils/regExpToken';

export default Vue.extend({
  name: 'RegexInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    valueWatchEventHandler: (): void => {
      // do nothing.
    },
    codeMirror: null as EditorFromTextArea|null,
    codeMirrorTextMarkers: [] as CodeMirror.TextMarker[],
  }),
  watch: {
    value(): void {
      this.valueWatchEventHandler();
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
          lineNumbers: false,
          theme: 'default',
          lineWrapping: true,
          mode: 'none',
        },
      );
      this.codeMirror.setValue(this.value);
      this.initializeChangeEventHandler();

      const colorSchemeMediaQueryList = this.getColorSchemeMediaQueryList();
      this.initializeColorSchemeEventHandler(colorSchemeMediaQueryList);
      this.updateTheme(colorSchemeMediaQueryList);
      this.updateHighlighting();
      this.valueWatchEventHandler = debounce(() => {
        this.updateHighlighting();
      }, 100);
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
    validateRegexString(): boolean {
      try {
        // Note, the value here is a backslash escaped regex string.
        // @todo: Force the user to enter a non-escaped regex string. E.g. "\/" -> "/"
        return new RegExp(this.value).toString()
          .slice(1, -1) === this.value;
      } catch (e) {
        return false;
      }
    },
    clearTextMarkers(): void {
      this.codeMirrorTextMarkers.forEach((textMarker) => {
        textMarker.clear();
      });
      this.codeMirrorTextMarkers = [];
    },
    updateHighlighting(): void {
      this.clearTextMarkers();
      if (!this.validateRegexString()) {
        return;
      }
      let regExpTokens = [];
      try {
        regExpTokens = regExpParser(this.value);
      } catch (e) {
        return;
      }

      if (this.codeMirror === null) {
        return;
      }
      const doc = this.codeMirror.getDoc();
      regExpTokens.forEach((regExpToken) => {
        if (this.codeMirror === null) {
          return;
        }

        if (
          regExpToken.type === 'literal'
          || regExpToken.type === 'match'
        ) {
          return;
        }

        if (
          regExpToken.type === 'capture-group'
          || regExpToken.type === 'non-capture-group'
          || regExpToken.type === 'positive-lookahead'
          || regExpToken.type === 'negative-lookahead'
          || regExpToken.type === 'non-capture-group'
        ) {
          const textMarkers = this.addTextMarkerForBraces(this.codeMirror, doc, regExpToken);
          this.codeMirrorTextMarkers.push(...textMarkers);
        } else {
          const textMarker = this.addTextMarkerForRange(this.codeMirror, doc, regExpToken);
          this.codeMirrorTextMarkers.push(textMarker);
        }
      });
    },
    addTextMarkerForRange(
      codeMirror: CodeMirror.EditorFromTextArea,
      doc: CodeMirror.Doc,
      regExpToken: RegExpToken,
    ): CodeMirror.TextMarker {
      return codeMirror.markText(
        doc.posFromIndex(regExpToken.indexStart),
        doc.posFromIndex(regExpToken.indexEnd),
        {
          className: `regexp-token-highlight-${regExpToken.type}`,
        },
      );
    },
    addTextMarkerForBraces(
      codeMirror: CodeMirror.EditorFromTextArea,
      doc: CodeMirror.Doc,
      regExpToken: RegExpToken,
    ): CodeMirror.TextMarker[] {
      const { indexStart, indexEnd, type } = regExpToken;
      let offset = 0;
      if (
        regExpToken.type === 'positive-lookahead'
        || regExpToken.type === 'negative-lookahead'
      ) {
        offset = 2;
      }
      return [
        this.addTextMarker(codeMirror, doc, indexStart - 1, indexStart + offset, type),
        this.addTextMarker(codeMirror, doc, indexEnd, indexEnd + 1, type),
      ];
    },
    addTextMarker(
      codeMirror: CodeMirror.EditorFromTextArea,
      doc: CodeMirror.Doc,
      indexStart: number,
      indexEnd: number,
      type: string,
    ): CodeMirror.TextMarker {
      return codeMirror.markText(
        doc.posFromIndex(indexStart),
        doc.posFromIndex(indexEnd),
        {
          className: `regexp-token-highlight-${type}`,
        },
      );
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
.regexp-token-highlight-quantifier {
  background: #0FD;
}
.regexp-token-highlight-capture-group,
.regexp-token-highlight-positive-lookahead,
.regexp-token-highlight-negative-lookahead,
.regexp-token-highlight-non-capture-group {
  background: #0F0;
}
.regexp-token-highlight-charset {
  background: #F90;
}
.regexp-token-highlight-range {
  background: #F70;
}
.regexp-token-highlight-literal-escaped {
  background: #CCC;
}
.regexp-token-highlight-alternate,
.regexp-token-highlight-tab,
.regexp-token-highlight-start,
.regexp-token-highlight-end,
.regexp-token-highlight-white-space,
.regexp-token-highlight-non-white-space,
.regexp-token-highlight-digit,
.regexp-token-highlight-non-digit,
.regexp-token-highlight-word,
.regexp-token-highlight-non-word,
.regexp-token-highlight-any-character,
.regexp-token-highlight-word-boundary,
.regexp-token-highlight-non-word-boundary,
.regexp-token-highlight-vertical-tab,
.regexp-token-highlight-line-feed,
.regexp-token-highlight-hex,
.regexp-token-highlight-back-reference,
.regexp-token-highlight-control-character,
.regexp-token-highlight-backspace,
.regexp-token-highlight-carriage-return,
.regexp-token-highlight-null-character,
.regexp-token-highlight-unicode {
  background: #5BF;
}

@media (prefers-color-scheme: dark) {
  .regexp-token-highlight-quantified {
    background: #055;
  }
  .regexp-token-highlight-capture-group,
  .regexp-token-highlight-positive-lookahead,
  .regexp-token-highlight-negative-lookahead,
  .regexp-token-highlight-non-capture-group {
    background: #050;
  }
  .regexp-token-highlight-charset {
    background: #530;
  }
  .regexp-token-highlight-range {
    background: #520;
  }
  .regexp-token-highlight-literal-escaped {
    background: #444;
  }
  .regexp-token-highlight-alternate,
  .regexp-token-highlight-tab,
  .regexp-token-highlight-start,
  .regexp-token-highlight-end,
  .regexp-token-highlight-white-space,
  .regexp-token-highlight-non-white-space,
  .regexp-token-highlight-digit,
  .regexp-token-highlight-non-digit,
  .regexp-token-highlight-word,
  .regexp-token-highlight-non-word,
  .regexp-token-highlight-any-character,
  .regexp-token-highlight-word-boundary,
  .regexp-token-highlight-non-word-boundary,
  .regexp-token-highlight-vertical-tab,
  .regexp-token-highlight-line-feed,
  .regexp-token-highlight-hex,
  .regexp-token-highlight-back-reference,
  .regexp-token-highlight-control-character,
  .regexp-token-highlight-backspace,
  .regexp-token-highlight-carriage-return,
  .regexp-token-highlight-null-character,
  .regexp-token-highlight-unicode {
    background: #035;
  }
}

</style>
