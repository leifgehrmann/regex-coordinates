<template>
  <table>
    <tr>
      <th>Group Number</th>
      <th>Type</th>
      <th v-if="regexMatchAllResult.length !== 0">
        <span class="table-heading-padding">
          Example matches in input data
        </span>
      </th>
    </tr>
    <tr
      v-for="item in items"
      :key="item.groupNumber"
      :item="item"
      :index="item.groupNumber"
    >
      <td>{{ item.groupNumber }}</td>
      <td>
        <MatchGroupTypeSelect
          :is-wgs84="isWgs84"
          :value.sync="item.groupSettings.type"
        />
      </td>
      <td v-if="regexMatchAllResult.length !== 0">
        <div class="horizontally-scrollable">
          <div
            v-for="(matchedValue, index) in item.groupMatches"
            :key="index"
            :item="matchedValue"
            :index="index"
            class="chip"
          >
            {{ matchedValue }}
          </div>
        </div>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import MatchGroupTypeSelect from '@/components/MatchGroupTypeSelect.vue';
import RegExpUnescape from '@/utils/regExpUnescape';
import { GroupSettingsArray } from '@/utils/groupSettings';
import RegExpMatchArrayInverter from '../utils/regExpMatchArrayInverter';

interface GroupSettings {
  type: string|null;
}

interface Item {
  groupNumber: number;
  groupSettings: GroupSettings;
  groupMatches: string[];
}

const items: Item[] = [];

function getNumberOfRegexCaptureGroups(regexString: string): number {
  try {
    // We can trick regex by passing in an alternative which matches blank
    // which will tell us the actual number of capture groups there are. ;)
    const regex = new RegExp(`${RegExpUnescape.unescape(regexString)}|`);
    const result = regex.exec('');
    if (result === null) {
      return 0;
    }
    return result.length - 1;
  } catch (e) {
    return 0;
  }
}

export default Vue.extend({
  name: 'GroupSettingsTable',
  components: {
    MatchGroupTypeSelect,
  },
  props: {
    regexString: {
      type: String,
      default: (): string => '',
    },
    regexMatchAllResult: {
      type: Array as () => RegExpMatchArray[],
      default: (): RegExpMatchArray[] => [],
    },
    isWgs84: {
      type: Boolean,
      default: (): boolean => false,
    },
    allGroupSettings: {
      type: Array as () => GroupSettingsArray,
      default: (): GroupSettings[] => [],
    },
  },
  data: () => ({
    items,
  }),
  watch: {
    $props: {
      deep: true,
      handler(): void {
        const numberOfGroups = getNumberOfRegexCaptureGroups(this.regexString);
        const inverter = new RegExpMatchArrayInverter();
        const allGroupMatches = inverter.transformMatchAll(this.regexMatchAllResult);

        // If the table has more rows than actual match groups, remove them.
        if (this.items.length > numberOfGroups) {
          this.items = this.items.slice(0, numberOfGroups);
        }

        // If the table has fewer rows than actual match groups, add new entries.
        if (this.items.length < numberOfGroups) {
          for (let i = this.items.length; i < numberOfGroups; i += 1) {
            const groupNumber = i + 1;
            let groupSettings: GroupSettings = {
              type: null,
            };
            if (this.allGroupSettings.length > i) {
              groupSettings = this.allGroupSettings[i];
            }
            this.items.push({
              groupNumber,
              groupSettings,
              groupMatches: [],
            });
          }
        }

        // Update the table with group matches from the parsed input data.
        allGroupMatches.forEach((groupMatches, groupNumber) => {
          // This can happen when Vue has only updated the regexString prop,
          // but not the regexMatchAllResult prop. So we just disregard
          // setting the property.
          if (groupNumber >= this.items.length) {
            return;
          }
          this.items[groupNumber].groupMatches = groupMatches;
        });

        // Clear any rows in the table if there aren't any group matches.
        for (
          let groupNumber = allGroupMatches.length;
          groupNumber < this.items.length;
          groupNumber += 1
        ) {
          this.items[groupNumber].groupMatches = [];
        }
      },
    },
    items: {
      handler(updatedItems: Item[]): void {
        let modified = false;
        // Clone the groupSettings so we can make changes to it.
        const newAllGroupSettings = this.allGroupSettings.map((a) => ({ ...a }));
        updatedItems.forEach((updatedItem, index) => {
          if (newAllGroupSettings.length < updatedItems.length) {
            newAllGroupSettings.push(updatedItem.groupSettings);
            modified = true;
          } else if (
            JSON.stringify(newAllGroupSettings[index]) !== JSON.stringify(updatedItem.groupSettings)
          ) {
            newAllGroupSettings[index] = updatedItem.groupSettings;
            modified = true;
          }
        });
        if (modified) {
          this.$emit('update:allGroupSettings', newAllGroupSettings);
        }
      },
      deep: true,
    },
  },
});
</script>

<style scoped>
.table-heading-padding {
  display: block;
  padding-left: 10px;
}

.horizontally-scrollable {
  padding-left: 10px;
  padding-right: 10px;
  overflow: hidden;
  width: 100%;
  height: 24px;
}

.horizontally-scrollable * {
  float: left;
}

table {
  padding: 0;
  border-spacing: 0;
  display: table;
  width: 100%;
  background-color: #FFF;
  border-radius: 4px;
}

@media (prefers-color-scheme: dark) {
  table {
    background-color: #212121;
  }
}

th:nth-child(1), td:nth-child(1) {
  width: 100px;
  min-width: 100px;
  text-align: center;
}

th:nth-child(2), td:nth-child(2) {
  width: calc(40% - 100px);
}

th:nth-child(3), td:nth-child(3) {
  width: calc(60% - 100px);
}

td, th {
  display: table-cell;
}

th {
  font-size: 12px;
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
}

tr td {
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.chip {
  border-radius: 12px;
  font-size: 12px;
  height: 24px;
  background: #e0e0e0;
  border-color: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.87);
  font-family: monospace;
  margin-right: 8px!important;
  align-items: center;
  cursor: default;
  display: inline-flex;
  line-height: 20px;
  max-width: 100%;
  outline: none;
  overflow: hidden;
  padding: 0 12px;
  position: relative;
  text-decoration: none;
  vertical-align: middle;
  white-space: nowrap;
}

@media (prefers-color-scheme: dark) {
  tr td {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .chip {
    background: #555;
    border-color: hsla(0,0%,100%,.12);
    color: #fff;
  }
}

</style>

<style>
.v-chip--monospace {
  font-family: monospace;
}
</style>
