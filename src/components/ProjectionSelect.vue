<template>
  <div
    v-on-clickaway="focusout"
  >
    <div class="container">
      <input
        class="search-input"
        type="text"
        @focusin="focusin"
        @keydown.enter="enter"
        @keydown.down="down"
        @keydown.up="up"
        @input="searchUpdate"
      >
      <div class="clear-button">
        <font-awesome-icon
          icon="times-circle"
          :style="{visibility: hasSomeInput ? 'visible' : 'hidden'}"
          @click="clearProjection"
        />
      </div>
    </div>
    <div
      v-if="searching"
      class="search-results-container"
    >
      <div class="search-results">
        <ul>
          <li
            v-for="(match, index) in matches"
            :key="index"
            @click="selectProjection(match)"
            :class="{ 'search-result-selected': index === current }"
          >
            {{ match }}
            <font-awesome-icon
              icon="info-circle"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mixin as clickaway } from 'vue-clickaway';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faTimesCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSearch);
library.add(faTimesCircle);
library.add(faInfoCircle);

export default Vue.extend({
  name: 'ProjectionSelect',
  components: {
    FontAwesomeIcon,
  },
  mixins: [clickaway],
  props: {
    selectedEpsgCode: {
      type: String,
      default: '',
    },
    selectedProj4: {
      type: String,
      default: '',
    },
    searchInput: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searching: false,
      current: 0,
      suggestions: ['123', '321', '4566', 'abc', 'efg'],
    };
  },
  computed: {
    selectedLabel(): string {
      if (this.selectedEpsgCode === '') {
        return 'Select a projection...';
      }
      return `${this.selectedEpsgCode} - BLA`;
    },
    matches(): string[] {
      return this.suggestions.filter((str) => str.indexOf(this.searchInput) >= 0);
    },
    hasSomeInput(): boolean {
      return (this.selectedEpsgCode !== '' || this.searching) && this.searchInput !== '';
    },
  },
  watch: {
    searchInput(): void {
      if (this.searching) {
        const inputField = this.getSearchInputField();
        inputField.value = this.searchInput;
      }
    },
    selectedEpsgCode(): void {
      if (!this.searching) {
        const inputField = this.getSearchInputField();
        inputField.value = this.selectedLabel;
      }
    },
  },
  mounted() {
    const inputField = this.getSearchInputField();
    inputField.value = this.selectedLabel;
  },
  methods: {
    getSearchInputField(): HTMLInputElement {
      const elements = this.$el.getElementsByClassName('search-input');
      return elements.item(0) as HTMLInputElement;
    },
    focusin(): void {
      const inputField = this.getSearchInputField();
      inputField.value = this.searchInput;
      inputField.setSelectionRange(0, inputField.value.length);
      this.searching = true;
    },
    focusout(): void {
      this.searching = false;
      const inputField = this.getSearchInputField();
      inputField.value = this.selectedLabel;
      inputField.setSelectionRange(0, inputField.value.length);
    },
    dismiss(): void {
      this.searching = false;
    },
    selectProjection(value: string): void {
      this.$emit('update:selectedEpsgCode', value);
      this.focusout();
    },
    clearProjection(): void {
      this.$emit('update:selectedEpsgCode', '');
      this.$emit('update:selectedProj4', '');
      this.$emit('update:searchInput', '');
      this.getSearchInputField().focus();
      this.focusin();
    },
    up(event: Event): void {
      if (this.current > 0) {
        this.current -= 1;
      }
      event.preventDefault();
    },
    down(event: Event): void {
      if (this.current < this.matches.length - 1) {
        this.current += 1;
      }
      event.preventDefault();
    },
    enter(): void {
      if (this.searching) {
        if (this.current < this.matches.length && this.current >= 0) {
          this.selectProjection(this.matches[this.current]);
        } else {
          this.focusout();
        }
      } else {
        this.focusin();
      }
    },
    isActive(index: number): boolean {
      return index === this.current;
    },
    change(): void {
      if (!this.searching) {
        this.searching = true;
        this.current = 0;
      }
    },
    // eslint-disable-next-line no-unused-vars
    suggestionClick(index: number): void {
      this.searching = false;
    },
    searchUpdate(event: Event): void {
      if (event.target !== null && this.searching) {
        const target = event.target as HTMLInputElement;
        this.$emit('update:searchInput', target.value);
      } else {
        this.focusin();
      }
    },
  },
});
</script>

<style scoped>
.container {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
  0 2px 2px 0 rgba(0, 0, 0, 0.14),
  0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background: #FFFFFF;
  position: relative;
  padding: 0;
}

.search-input {
  width: 100%;
  border-radius: 4px;
  padding-left: 7px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.clear-button {
  display: inline-block;
  position: absolute;
  right: 7px;
  top: 6px;
}

.selected-name {
  display: inline-block;
}

.search-results-container {
  position: relative;
  width: 100%;
  height: 0;
}

.search-results {
  background: #FFF;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
  0 8px 10px 1px rgba(0, 0, 0, 0.14),
  0 3px 14px 2px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: absolute;
  top: 5px;
  z-index: 10;
}

.search-results ul {
  list-style: none;
  padding: 4px 0;
}

.search-results ul li {
  cursor: pointer;
  padding: 2px 8px 2px 8px;
}

.search-results ul li:hover {
  background: rgba(0, 0, 0, 0.05);
}

.search-result-selected {
  background: rgba(0, 0, 0, 0.1);
}

.svg-inline--fa {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

@media (prefers-color-scheme: dark) {
  .container {
    background: #212121;
  }

  .search-results {
    background: #212121;
  }

  .search-results ul li:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .selected-flags-icon {
    background: #FFF;
  }
}
</style>

<style>

</style>
