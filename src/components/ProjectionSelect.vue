<template>
  <div>
    <div class="container">
      <div class="search-button">
        <font-awesome-icon
          icon="search"
        />
        <font-awesome-icon
          icon="times-circle"
          style="display: none"
        />
      </div>
      <input
        class="search-input"
        type="text"
        value="EPSG:4326 - WGS 84"
        @keydown.enter="enter"
        @keydown.down="down"
        @keydown.up="up"
        @input="change"
      >
    </div>
    <div class="search-results-container">
      <div class="search-results">
        <ul>
          <li>
            Hello World
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

.search-button {
  display: inline-block;
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
  padding-top: 5px;
  padding-bottom: 5px;
}

.search-results ul {
  list-style: none;
  padding: 0;
}

.search-results ul li {
  cursor: pointer;
  padding: 2px 8px 2px 8px;
}

.search-results ul li:hover {
  background: rgba(0, 0, 0, 0.05);
}

.svg-inline--fa {
  width: 16px;
  height: 16px;
  margin-left: 2px;
  margin-right: 2px;
  opacity: 0.8;
}
</style>

<style>

</style>
