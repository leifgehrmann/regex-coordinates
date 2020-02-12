<template>
  <div
    v-click-outside="focusout"
  >
    <popper
      trigger="click"
      :visible-arrow="false"
      :force-show="searching"
      :options="{
        placement: 'bottom-start',
        'boundaries-selector': 'v-application'
      }"
    >
      <input
        slot="reference"
        class="search-input"
        type="text"
        placeholder=""
        @focusin="focusin"
        @keydown.enter="enter"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.tab="focusout"
        @input="searchUpdate"
      >
      <div class="popper">
        <div class="search-results">
          <ul class="search-results-list">
            <li
              v-for="(option, index) in options"
              :key="index"
              class="search-results-list-item"
            >
              {{ option.text }}
            </li>
          </ul>
        </div>
      </div>
    </popper>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import vClickOutside from 'v-click-outside';
import Popper from 'vue-popperjs';

interface SelectOption {
  value: string|null;
  text: string;
}

export default Vue.extend({
  name: 'MatchGroupTypeSelect',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    Popper,
  },
  props: {
    isWgs84: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searching: false,
    };
  },
  computed: {
    options(): SelectOption[] {
      if (this.isWgs84) {
        return [
          { value: null, text: '' },
          { value: 'x', text: 'Longitude (Decimal)' },
          { value: 'y', text: 'Latitude (Decimal)' },
          { value: 'name', text: 'Category name' },
          { value: 'time', text: 'Time' },
        ];
      }
      return [
        { value: null, text: '' },
        { value: 'x', text: 'X Coordinate' },
        { value: 'y', text: 'Y Coordinate' },
        { value: 'name', text: 'Category name' },
        { value: 'time', text: 'Time' },
      ];
    },
  },
  methods: {
    update(value: string): void {
      this.$emit('update:value', value);
    },
    focusin(): void {
      console.log('focusin');
      this.searching = true;
    },
    focusout(): void {
      console.log('focusout');
      this.searching = false;
    },
    enter(): void {
      console.log('enter');
    },
    down(): void {
      console.log('down');
    },
    up(): void {
      console.log('up');
    },
    searchUpdate(): void {
      console.log('searchUpdate');
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
  max-width: 270px;
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
  max-height: 400px;
  overflow-y: scroll;
}

.search-results ul {
  list-style: none;
  padding: 4px 0;
}

.search-results ul li {
  cursor: pointer;
  padding: 2px 8px 2px 8px;
}

.search-result-list-item-selected {
  background: rgba(0, 0, 0, 0.1);
}

.search-results-epsg-io a {
  text-decoration: none;
}

.svg-inline--fa {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

.svg-inline--fa.fa-times-circle {
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .container {
    background: #212121;
  }

  .search-results {
    background: #212121;
  }

  .search-result-list-item-selected {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>

<style>
.popper {
  z-index: 1;
}

.popper .search-results {
  background: #FFF;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
  0 8px 10px 1px rgba(0, 0, 0, 0.14),
  0 3px 14px 2px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: absolute;
  top: 5px;
  z-index: 20;
  max-height: 400px;
  overflow-y: scroll;
  width: 170px;
}

.popper .search-results ul {
  list-style: none;
  padding: 4px 0;
}

.popper .search-results ul li {
  cursor: pointer;
  padding: 2px 8px 2px 8px;
}

.search-result-list-item-selected {
  background: rgba(0, 0, 0, 0.1);
}

.popper .search-results-epsg-io a {
  text-decoration: none;
}

.svg-inline--fa {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

.svg-inline--fa.fa-times-circle {
  cursor: pointer;
}
</style>
