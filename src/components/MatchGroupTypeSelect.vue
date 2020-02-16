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
            :style="{display: !searching ? 'inline-block' : 'none'}"
            @click="toggle"
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
              @click="selectOptionFromList(option, index)"
              @mousemove="current = index"
            >
              <span v-if="option.text === ''">-</span>
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
  value: string;
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
      rawValue: '',
      current: 0,
    };
  },
  computed: {
    options(): SelectOption[] {
      const options: SelectOption[] = [];
      options.push({ value: '', text: '' });
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
    labels(): {[key: string]: string} {
      const labels: {[key: string]: string} = {};
      this.options.forEach((option) => {
        labels[option.value] = option.text;
      });
      return labels;
    },
  },
  watch: {
    isWgs84(): void {
      this.displaySelected();
    },
  },
  mounted() {
    if (this.value !== null) {
      this.rawValue = this.value;
      if (this.rawValue.startsWith(this.customPrefix)) {
        this.current = 1;
        this.rawInput = this.rawValue.substr(this.customPrefix.length);
      }
      this.current = this.options.findIndex((option) => option.value === this.rawValue);
    }
    this.displaySelected();
  },
  methods: {
    getSearchInputField(): HTMLInputElement {
      const elements = this.$el.getElementsByClassName('search-input');
      return elements.item(0) as HTMLInputElement;
    },
    getCurrentSearchResultListItem(): HTMLLIElement|null {
      const elements = this.$el.getElementsByClassName('search-results-list-item');
      return elements.item(this.current) as HTMLLIElement;
    },
    displaySelected(): void {
      const value = this.rawValue;
      const inputField = this.getSearchInputField();
      if (value === '') {
        inputField.value = '';
      } else {
        inputField.value = this.labels[value];
      }
    },
    displayRaw(): void {
      const inputField = this.getSearchInputField();
      inputField.value = this.rawInput;
    },
    update(value: string, index: number): void {
      this.$emit('update:value', value);
      this.rawValue = value;
      this.current = index;
    },
    focusin(): void {
      const inputField = this.getSearchInputField();
      inputField.focus();
      inputField.setSelectionRange(0, inputField.value.length);
      this.displayRaw();
      this.searching = true;
    },
    focusout(): void {
      const inputField = this.getSearchInputField();
      inputField.blur();
      this.displaySelected();
      this.searching = false;
    },
    selectOption(option: SelectOption, index: number): void {
      this.update(option.value, index);
    },
    selectOptionFromList(option: SelectOption, index: number): void {
      this.selectOption(option, index);
      this.focusout();
    },
    enter(): void {
      if (this.searching) {
        if (this.current < this.options.length && this.current >= 0) {
          this.selectOption(this.options[this.current], this.current);
          this.focusout();
        } else {
          this.focusout();
        }
      } else {
        this.focusin();
      }
    },
    up(event: Event): void {
      if (this.current > 0) {
        this.current -= 1;
      }
      this.scrollToCurrentListItem();
      event.preventDefault();
    },
    down(event: Event): void {
      if (this.current < this.options.length - 1) {
        this.current += 1;
      }
      this.scrollToCurrentListItem();
      event.preventDefault();
    },
    toggle(): void {
      if (this.searching) {
        this.focusout();
      } else {
        this.focusin();
      }
    },
    scrollToCurrentListItem(): void {
      const currentListItem = this.getCurrentSearchResultListItem();
      if (currentListItem !== null) {
        currentListItem.scrollIntoView({ block: 'nearest', inline: 'start' });
      }
    },
    searchUpdate(): void {
      const inputField = this.getSearchInputField();
      this.rawInput = inputField.value;
      this.current = 1;
    },
  },
});
</script>

<style scoped>
.container {
  border: 1px solid #CCC;
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
  top: 7px;
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
    border: 1px solid #424242;
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
}

.popper .search-results ul {
  list-style: none;
  padding: 4px 0;
}

.popper .search-results ul li {
  white-space: nowrap;
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
