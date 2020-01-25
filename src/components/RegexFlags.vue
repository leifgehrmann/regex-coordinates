<template>
  <div>
    <div
      class="selected-flags"
      @click="showDropdown = !showDropdown"
    >
      gmiyus
    </div>
    <div class="dropdown-container">
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

.dropdown-container {
  position: relative;
  width: 0;
  height: 0;
  left: 100%;
}

.dropdown {
  background: #FFF;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: absolute;
  top: 3px;
  right: 0;
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
  padding: 2px 8px 2px 35px;
}

.dropdown ul li:hover {
  background: rgba(0, 0, 0, 0.05);
}
@media (prefers-color-scheme: dark) {
  .dropdown {
    background: #212121;
  }
  .dropdown ul li:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>
