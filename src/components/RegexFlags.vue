<template>
  <div>
    <div
      class="selected-flags"
      @click="showDropdown = !showDropdown"
    >
      gmiyus
    </div>
    <div
      v-if="showDropdown"
      v-on-clickaway="dismiss"
      class="dropdown"
      @click="dismiss"
    >
      <ul>
        <li
          v-for="flagOptionItem in flagOptionItems"
          :key="flagOptionItem.key"
        >
          {{ flagOptionItem.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mixin as clickaway } from 'vue-clickaway';

interface FlagOptions {
  global: boolean;
  multiline: boolean;
  insensitive: boolean;
  singleline: boolean;
  unicode: boolean;
  sticky: boolean;
}

export default Vue.extend({
  name: 'RegexFlags',
  mixins: [clickaway],
  props: {
    flags: {
      type: Object,
      default: (): FlagOptions => ({
        global: false,
        multiline: false,
        insensitive: false,
        singleline: false,
        unicode: false,
        sticky: false,
      }),
    },
  },
  data: () => ({
    showDropdown: true,
    flagOptionItems: {
      global: { key: 'global', label: 'global' },
      multiline: { key: 'multiline', label: 'multiline' },
      insensitive: { key: 'insensitive', label: 'insensitive' },
      singleline: { key: 'singleline', label: 'singleline' },
      unicode: { key: 'unicode', label: 'unicode' },
      sticky: { key: 'sticky', label: 'sticky' },
    },
  }),
  methods: {
    dismiss(): void {
      this.showDropdown = false;
    },
  },
});
</script>

<style scoped>
.selected-flags {
  font-family: monospace;
  cursor: pointer;
  user-select: none;
}

.selected-flags:hover {
  opacity: 0.8;
}

.dropdown {
  background: #FFF;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: absolute;
  z-index: 10;
  padding-top: 5px;
  padding-bottom: 5px;
}

.dropdown ul {
  list-style: none;
  padding: 0;
}

.dropdown ul li {
  cursor: pointer;
  padding: 0 5px;
}

.dropdown ul li:hover {
  background: rgba(0, 0, 0, 0.1);
}
@media (prefers-color-scheme: dark) {
  .dropdown {
    border: 1px solid #FFF;
    background: #000;
  }
  .dropdown ul li span {
    color: #AAEEFF;
  }
}
</style>
