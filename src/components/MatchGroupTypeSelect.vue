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
      <div
        slot="reference"
        class="container"
      >
        <input
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
        <div class="dropdown-icon">
          <font-awesome-icon
            icon="chevron-down"
            :style="{visibility: searching}"
            @click="focusin"
          />
        </div>
      </div>
      <div class="popper">
        <div class="search-results">
          <ul class="search-results-list">
            <li
              v-for="(option, index) in options"
              :key="index"
              :class="{ 'search-result-list-item-selected': index === current }"
              class="search-results-list-item"
              @click="selectOption(option, index)"
              @mousemove="current = index"
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChevronDown);

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
    FontAwesomeIcon,
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
      customPrefix: 'custom:',
      searching: false,
      rawInput: '',
      current: 0,
    };
  },
  computed: {
    options(): SelectOption[] {
      const options: SelectOption[] = [];
      options.push({ value: null, text: '' });
      if (this.rawInput !== '') {
        options.push({ value: `${this.customPrefix}${this.rawInput}`, text: `Custom: ${this.rawInput}` });
      }
      if (this.isWgs84) {
        options.push({ value: 'x', text: 'Longitude (Decimal)' });
        options.push({ value: 'y', text: 'Latitude (Decimal)' });
      } else {
        options.push({ value: 'x', text: 'X Coordinate' });
        options.push({ value: 'y', text: 'Y Coordinate' });
      }
      return options;
    },
  },
  mounted() {
    if (this.value === null) {
      return;
    }

    const inputField = this.getSearchInputField();
    if (this.value.startsWith(this.customPrefix)) {
      this.rawInput = this.value.substr(this.customPrefix.length);
      inputField.value = `Custom: ${this.rawInput}`;
    } else {
      this.rawInput = '';
      const optionIndex = this.options.findIndex((option) => option.value === this.value);
      inputField.value = this.options[optionIndex].text;
    }
  },
  methods: {
    getSearchInputField(): HTMLInputElement {
      const elements = this.$el.getElementsByClassName('search-input');
      return elements.item(0) as HTMLInputElement;
    },
    update(value: string): void {
      this.$emit('update:value', value);
    },
    focusin(): void {
      console.log('focusin');
      const inputField = this.getSearchInputField();
      inputField.focus();
      this.searching = true;
    },
    focusout(): void {
      console.log('focusout');
      this.searching = false;
    },
    selectOption(option: string, index: number): void {
      console.log('select', option, index);
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
      const inputField = this.getSearchInputField();
      this.rawInput = inputField.value;
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

.dropdown-icon {
  display: inline-block;
  position: absolute;
  right: 7px;
  top: 6px;
  cursor: pointer;
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
  min-width: 170px;
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

@media (prefers-color-scheme: dark) {

  .popper .search-results {
    background: #212121;
  }

  .popper .search-result-list-item-selected {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
