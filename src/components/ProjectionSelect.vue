<template>
  <div
    v-on-clickaway="focusout"
  >
    <div class="container">
      <input
        class="search-input"
        type="text"
        placeholder="Enter an EPSG code or name"
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
        <ul class="search-results-list">
          <li
            v-for="(match, index) in matches"
            :key="index"
            :class="{ 'search-result-list-item-selected': index === current }"
            class="search-results-list-item"
            @click="selectProjection(match, index)"
            @mousemove="current = index"
          >
            EPSG:{{ match.code }} - {{ match.name }}
          </li>
          <li
            v-if="searchInput.length > 0"
            class="search-results-epsg-io"
          >
            <a
              target="_blank"
              :href="`https://epsg.io/?q=${encodeURI(searchInput)}`">
              <font-awesome-icon
                icon="search"
              />
              Search EPSG.io for '{{ searchInput }}'...
            </a>
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
import allEpsgProjections from 'epsg-index/all.json';

library.add(faSearch);
library.add(faTimesCircle);
library.add(faInfoCircle);

interface Projection {
  accuracy: number|null;
  area: string|null;
  bbox: number[]|null;
  code: string;
  kind: string;
  name: string;
  proj4: string|null;
  unit: string|null;
  wkt: string|null;
}

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
      selectedName: '',
      maxMatches: 50,
      projections: [] as Projection[],
    };
  },
  computed: {
    selectedLabel(): string {
      if (this.selectedEpsgCode === '') {
        return 'Select a projection...';
      }
      return `EPSG:${this.selectedEpsgCode} - ${this.selectedName}`;
    },
    matches(): Projection[] {
      if (this.searchInput.length === 0) {
        return [];
      }
      const matches: Projection[] = [];
      const searchInputLower = this.searchInput.toLowerCase();
      this.projections.every((projection): boolean => {
        if (matches.length > this.maxMatches + 1) {
          return false;
        }
        let foundMatch = false;
        if (
          !foundMatch
          && (
            projection.code.indexOf(searchInputLower) !== -1
            || `epsg:${projection.code}`.indexOf(searchInputLower) !== -1
          )
        ) {
          foundMatch = true;
        }
        if (
          !foundMatch
          && projection.name.toLowerCase().indexOf(searchInputLower) !== -1
        ) {
          foundMatch = true;
        }
        if (
          !foundMatch
          && projection.area && projection.area.toLowerCase().indexOf(searchInputLower) !== -1
        ) {
          foundMatch = true;
        }
        if (foundMatch && projection.proj4 !== null) {
          matches.push(projection);
        }
        return true;
      });
      return matches;
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
    const selectedProjection = (
      allEpsgProjections as {[key: string]: Projection}
    )[this.selectedEpsgCode];
    this.projections = Object.values(allEpsgProjections as {[key: string]: Projection});
    this.selectedName = selectedProjection.name;
    this.$emit('update:selectedProj4', selectedProjection.code);
    inputField.value = this.selectedLabel;
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
    selectProjection(projection: Projection, index: number): void {
      this.$emit('update:selectedEpsgCode', projection.code);
      this.$emit('update:selectedProj4', projection.proj4);
      this.current = index;
      this.selectedName = projection.name;
      this.focusout();
    },
    clearProjection(): void {
      this.$emit('update:selectedEpsgCode', '');
      this.$emit('update:selectedProj4', '');
      this.$emit('update:searchInput', '');
      this.selectedName = '';
      this.getSearchInputField().focus();
      this.focusin();
    },
    up(event: Event): void {
      if (this.current > 0) {
        this.current -= 1;
      }
      const currentListItem = this.getCurrentSearchResultListItem();
      if (currentListItem !== null) {
        currentListItem.scrollIntoView({ block: 'nearest', inline: 'start' });
      }
      event.preventDefault();
    },
    down(event: Event): void {
      if (this.current < this.matches.length - 1) {
        this.current += 1;
      }
      const currentListItem = this.getCurrentSearchResultListItem();
      if (currentListItem !== null) {
        currentListItem.scrollIntoView({ block: 'nearest', inline: 'start' });
      }
      event.preventDefault();
    },
    enter(): void {
      if (this.searching) {
        if (this.current < this.matches.length && this.current >= 0) {
          this.selectProjection(this.matches[this.current], this.current);
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

@media (prefers-color-scheme: dark) {
  .container {
    background: #212121;
  }

  .search-results {
    background: #212121;
  }

  .selected-flags-icon {
    background: #FFF;
  }
}
</style>

<style>

</style>
