<template>
  <div class="container">
    <div class="selected-name">
      EPSG:4326 - WGS84
    </div>
    <input
      class="search-input"
      type="text"
      value="Test"
      @keydown.enter="enter"
      @keydown.down="down"
      @keydown.up="up"
      @input="change"
    >
    <div class="search-button">
      <font-awesome-icon
        icon="search"
      />
      <font-awesome-icon
        icon="times-circle"
      />
    </div>
    <div class="search-results">
      <ul>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSearch);
library.add(faTimesCircle);

export default Vue.extend({
  name: 'ProjectionSelect',
  components: {
    FontAwesomeIcon,
  },
  props: {
    selection: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searching: false,
      open: false,
      current: 0,
      suggestions: ['123', '4566'],
    };
  },
  computed: {
    matches(): string[] {
      return this.suggestions.filter((str) => str.indexOf(this.selection) >= 0);
    },
    openSuggestion(): boolean {
      return this.selection !== ''
        && this.matches.length !== 0
        && this.open === true;
    },
  },
  methods: {
    enter(): void {
      // this.selection = this.matches[this.current];
      this.open = false;
    },
    up(): void {
      if (this.current > 0) {
        this.current -= 1;
      }
    },
    down(): void {
      if (this.current < this.matches.length - 1) {
        this.current += 1;
      }
    },
    isActive(index: number): boolean {
      return index === this.current;
    },
    change(): void {
      if (this.open === false) {
        this.open = true;
        this.current = 0;
      }
    },
    // eslint-disable-next-line no-unused-vars
    suggestionClick(index: number): void {
      // this.selection = this.matches[index];
      this.open = false;
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
  padding: 4px;
  background: #FFFFFF;
}
</style>

<style>

</style>
