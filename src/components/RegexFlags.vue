<template>
  <div>
    <div
      class="selected-flags-container"
      @click="showDropdown = !showDropdown"
    >
      <span class="selected-flags">{{ selectedFlags }}</span>
      <font-awesome-icon icon="flag" />
    </div>
    <div class="dropdown-container">
      <div
        v-if="showDropdown"
        v-click-outside="dismiss"
        class="dropdown"
      >
        <ul>
          <li
            v-for="flagOptionItem in flagOptionItems"
            :key="flagOptionItem.key"
            @click="flagOptionItem.selected = !flagOptionItem.selected"
          >
            <font-awesome-icon
              icon="check"
              :style="{visibility: flagOptionItem.selected ? 'visible' : 'hidden'}"
            />
            {{ flagOptionItem.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFlag, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import vClickOutside from 'v-click-outside';
import RegExpFlagsConfig from '@/utils/regExpFlagsConfig';

library.add(faFlag);
library.add(faCheck);

export default Vue.extend({
  name: 'RegexFlags',
  components: {
    FontAwesomeIcon,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    flags: {
      type: Object,
      default: (): RegExpFlagsConfig => ({}),
    },
  },
  data: () => ({
    showDropdown: false,
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

.svg-inline--fa {
  width: 16px;
  height: 16px;
  margin-left: 2px;
  margin-right: 2px;
  opacity: 0.8;
}

.selected-flags-container:hover {
  opacity: 0.8;
}

.dropdown-container {
  position: relative;
  width: 0;
  height: 0;
  left: 100%;
}

.dropdown {
  width: 120px;
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
  padding: 2px 8px 2px 8px;
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
