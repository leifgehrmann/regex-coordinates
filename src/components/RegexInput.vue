<template>
  <div>
    <div class="codemirror-container">
      <textarea
        ref="textarea"
      />
    </div>
    <div
      class="validation"
      :class="{ 'validation-has-errors': error }"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CodeMirror, { EditorFromTextArea } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import { debounce } from 'debounce';
import regExpParser, { Token } from 'regexp';
import regExpTokenFlattener from '@/utils/regExpTokenFlattener';
import RegExpFlatToken from '@/utils/regExpFlatToken';
import RegExpUnescape from '@/utils/regExpUnescape';

export default Vue.extend({
  name: 'RegexInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    errorMessage: 'Hello!',
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
      this.update();
      this.valueWatchEventHandler = debounce(() => {
        this.update();
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
    update(): void {
      let regExpTokens = null;
      try {
        regExpTokens = regExpParser(this.value);
        this.updateHighlighting(regExpTokens);
      } catch (e) {
        this.errorMessage = '';
        this.clearTextMarkers();
        try {
          RegExp(RegExpUnescape.unescape(this.value));
        } catch (e2) {
          this.errorMessage = e2.toString().replace(/^[^:]*:/, '');
        }
        if (this.errorMessage === '') {
          this.errorMessage = e.toString();
        }
        this.$emit('update:error', true);
        return;
      }
      this.errorMessage = '';
      this.$emit('update:error', false);
    },
    clearTextMarkers(): void {
      this.codeMirrorTextMarkers.forEach((textMarker) => {
        textMarker.clear();
      });
      this.codeMirrorTextMarkers = [];
    },
    updateHighlighting(regExpToken: Token): void {
      this.clearTextMarkers();
      const regExpFlatTokens = regExpTokenFlattener(regExpToken);

      if (this.codeMirror === null) {
        return;
      }
      const doc = this.codeMirror.getDoc();
      regExpFlatTokens.forEach((regExpFlatToken) => {
        if (this.codeMirror === null) {
          return;
        }

        if (
          regExpFlatToken.type === 'literal'
          || regExpFlatToken.type === 'match'
        ) {
          return;
        }

        if (
          regExpFlatToken.type === 'capture-group'
          || regExpFlatToken.type === 'non-capture-group'
          || regExpFlatToken.type === 'positive-lookahead'
          || regExpFlatToken.type === 'negative-lookahead'
          || regExpFlatToken.type === 'non-capture-group'
        ) {
          const textMarkers = this.addTextMarkerForBraces(this.codeMirror, doc, regExpFlatToken);
          this.codeMirrorTextMarkers.push(...textMarkers);
        } else {
          const textMarker = this.addTextMarkerForRange(this.codeMirror, doc, regExpFlatToken);
          this.codeMirrorTextMarkers.push(textMarker);
        }
      });
    },
    addTextMarkerForRange(
      codeMirror: CodeMirror.EditorFromTextArea,
      doc: CodeMirror.Doc,
      regExpFlatToken: RegExpFlatToken,
    ): CodeMirror.TextMarker {
      return codeMirror.markText(
        doc.posFromIndex(regExpFlatToken.indexStart),
        doc.posFromIndex(regExpFlatToken.indexEnd),
        {
          className: `regexp-token-highlight-${regExpFlatToken.type}`,
        },
      );
    },
    addTextMarkerForBraces(
      codeMirror: CodeMirror.EditorFromTextArea,
      doc: CodeMirror.Doc,
      regExpFlatToken: RegExpFlatToken,
    ): CodeMirror.TextMarker[] {
      const { indexStart, indexEnd, type } = regExpFlatToken;
      let offset = 0;
      if (
        regExpFlatToken.type === 'positive-lookahead'
        || regExpFlatToken.type === 'negative-lookahead'
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
.codemirror-container {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
  0 2px 2px 0 rgba(0, 0, 0, 0.14),
  0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 4px;
  background: #FFFFFF;
}

@media (prefers-color-scheme: dark) {
  .codemirror-container {
    background: #212121;
  }
}

.validation {
  padding-top: 5px;
  color: #D44;
  min-height: 30px;
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
