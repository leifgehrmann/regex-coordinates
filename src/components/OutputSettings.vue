<template>
  <div>
    <div class="feature-type">
      <input
        id="points"
        v-model="mountedFeatureType"
        type="radio"
        value="points"
      >
      <label for="points">Points</label>
      <input
        id="both"
        v-model="mountedFeatureType"
        type="radio"
        value="both"
      >
      <label for="both">Both</label>
      <input
        id="linestring"
        v-model="mountedFeatureType"
        type="radio"
        value="linestring"
      >
      <label for="linestring">Linestring</label>
    </div>
    <div
      class="group-settings"
      :style="{display: featureType !== 'points' ? 'block' : 'none'}"
    >
      <div class="group-by">
        <label for="group-by">Group by...</label>
        <select
          id="group-by"
          v-model="mountedGroupBy"
        >
          <option
            v-for="(customType, index) in customTypes"
            :key="index"
            :value="customType.value"
          >
            {{ customType.text }}
          </option>
        </select>
        <span class="dropdown-icon">
          <font-awesome-icon icon="chevron-down" />
        </span>
      </div>
      <br>
      <div class="order-by">
        <label for="order-by">Order by...</label>
        <select
          id="order-by"
          v-model="mountedOrderBy"
        >
          <option
            v-for="(customType, index) in customTypes"
            :key="index"
            :value="customType.value"
          >
            {{ customType.text }}
          </option>
        </select>
        <span
          class="dropdown-icon"
        >
          <font-awesome-icon icon="chevron-down" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import GroupSettings, { GroupSettingsArray } from '@/utils/groupSettings';

library.add(faChevronDown);

interface SelectOption {
  value: string;
  text: string;
}

export default Vue.extend({
  name: 'OutputSettings',
  components: {
    FontAwesomeIcon,
  },
  props: {
    allGroupSettings: {
      type: Array as () => GroupSettingsArray,
      default: (): GroupSettings[] => [],
    },
    featureType: {
      type: String,
      default: (): string => 'points',
    },
    groupBy: {
      type: String,
      default: (): string => '',
    },
    orderBy: {
      type: String,
      default: (): string => 'custom:time',
    },
  },
  data: () => ({
    mountedFeatureType: '',
    mountedGroupBy: '',
    mountedOrderBy: '',
  }),
  computed: {
    customTypes(): SelectOption[] {
      const customTypes: SelectOption[] = [{ value: '', text: '-' }];
      this.allGroupSettings.forEach((groupSettings) => {
        if (groupSettings.type !== null && groupSettings.type.startsWith('custom:')) {
          customTypes.push({
            value: groupSettings.type,
            text: groupSettings.type.substr('custom:'.length),
          });
        }
      });
      return customTypes;
    },
    customTypeValues(): string[] {
      return this.customTypes.map((customType) => customType.value);
    },
  },
  watch: {
    allGroupSettings: {
      handler(): void {
        const groupByDoesNotExist = this.customTypeValues.indexOf(this.mountedGroupBy) === -1;
        const orderByDoesNotExist = this.customTypeValues.indexOf(this.mountedOrderBy) === -1;
        if (groupByDoesNotExist) {
          this.mountedGroupBy = '';
        }
        if (orderByDoesNotExist) {
          this.mountedOrderBy = '';
        }
      },
      deep: true,
    },
    mountedFeatureType(): void {
      this.$emit('update:featureType', this.mountedFeatureType);
    },
    mountedGroupBy(): void {
      this.$emit('update:groupBy', this.mountedGroupBy);
    },
    mountedOrderBy(): void {
      this.$emit('update:orderBy', this.mountedOrderBy);
    },
  },
  mounted(): void {
    this.mountedFeatureType = this.featureType;
    this.mountedGroupBy = this.groupBy;
    this.mountedOrderBy = this.orderBy;
  },
});
</script>

<style scoped>
.feature-type {
  width: 100%;
  display: flex;
  flex-direction: row;
  background: #FFF;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  margin: 5px 0;
}
.feature-type label {
  cursor: pointer;
  text-align: center;
  flex-grow: 1;
  padding: 10px;
}

.feature-type input:checked + label {
  background: rgba(0, 0, 0, 0.1);
  font-weight: bold;
}

.feature-type input:checked + label:first-of-type {
  border-radius: 4px 0 0 4px;
}

.feature-type input:checked + label:last-of-type {
  border-radius: 0 4px 4px 0;
}

.feature-type input {
  display:none;
}

.group-by, .order-by {
  margin: 5px 0;
  display: inline-flex;
  flex-direction: row;
  background: #EFEFEF;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: relative;
}

.group-by label, .order-by label {
  border-radius: 4px 0 0 4px;
  padding: 5px 10px;
}

.group-by select, .order-by select {
  background: #FFF;
  padding: 5px 31px 5px 10px;
  border-radius: 0 4px 4px 0;
}

.dropdown-icon {
  pointer-events: none;
  position: absolute;
  top: calc(50% - 10px);
  right: 10px;
}

@media (prefers-color-scheme: dark) {

}

</style>