<template>
  <div>
    <div
      class="selected-flags-container"
      @click="showDropdown = !showDropdown"
    >
      <span class="selected-flags">{{ selectedFlags }}</span>
      <span class="selected-flags-icon" />
    </div>
    <div class="dropdown-container">
      <div
        v-if="showDropdown"
        v-on-clickaway="dismiss"
        class="dropdown"
      >
        <ul>
          <li
            v-for="flagOptionItem in flagOptionItems"
            :key="flagOptionItem.key"
            @click="flagOptionItem.selected = !flagOptionItem.selected"
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
import RegExpFlagsConfig from '@/utils/regExpFlagsConfig';

export default Vue.extend({
  name: 'RegexFlags',
  mixins: [clickaway],
  props: {
    flags: {
      type: Object,
      default: (): RegExpFlagsConfig => ({}),
    },
  },
  data: () => ({
    showDropdown: true,
    flagOptionItems: [
      {
        flag: 'g', key: 'global', label: 'global', selected: false,
      },
      {
        flag: 'm', key: 'multiline', label: 'multiline', selected: false,
      },
      {
        flag: 'i', key: 'insensitive', label: 'insensitive', selected: false,
      },
      {
        flag: 's', key: 'singleline', label: 'singleline', selected: false,
      },
      {
        flag: 'u', key: 'unicode', label: 'unicode', selected: false,
      },
      {
        flag: 'y', key: 'sticky', label: 'sticky', selected: false,
      },
    ],
  }),

  computed: {
    selectedFlags(): string {
      let output = '';
      this.flagOptionItems.forEach((flagOptionItem) => {
        if (flagOptionItem.selected) {
          output += flagOptionItem.flag;
        }
      });
      return output;
    },
  },
  watch: {
    $props: {
      deep: true,
      handler(): void {
        this.setFlags();
      },
    },
    flagOptionItems: {
      handler(): void {
        this.flagOptionItems.forEach(({ key, selected }) => {
          this.flags[key] = selected;
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.setFlags();
  },
  methods: {
    setFlags(): void {
      this.flagOptionItems.forEach(({ key }, i) => {
        this.flagOptionItems[i].selected = this.flags[key];
      });
    },
    dismiss(): void {
      this.showDropdown = false;
    },
  },
});
</script>

<style scoped>
.selected-flags-container {
  font-family: monospace;
  cursor: pointer;
  user-select: none;
}

.selected-flags-icon {
  display: inline-block;
  background: #000;
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
  margin-left: 2px;
  margin-right: 2px;
}

.selected-flags-container:hover .selected-flags-icon {
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

  .selected-flags-icon {
    background: #FFF;
  }
}
</style>
