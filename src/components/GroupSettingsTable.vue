<template>
  <table>
    <tr>
      <th>Group Number</th>
      <th>Type</th>
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
          :value.sync="item.groupSettings.type"
        />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import MatchGroupTypeSelect from '@/components/MatchGroupTypeSelect.vue';

interface GroupSettings {
  type: string|null;
}

type GroupSettingsArray = GroupSettings[];

interface Item {
  groupNumber: number;
  groupSettings: GroupSettings;
}

const items: Item[] = [];

function getNumberOfRegexCaptureGroups(regexString: string): number {
  try {
    // We can trick regex by passing in an alternative which matches blank
    // which will tell us the actual number of capture groups there are. ;)
    const regex = new RegExp(`${regexString}|`);
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
    regex: {
      type: String,
      default: (): string => '',
    },
    matches: {
      type: Array,
      default: (): string[][] => [],
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
        const numberOfGroups = getNumberOfRegexCaptureGroups(this.regex);

        // If the array is too long...
        if (this.items.length > numberOfGroups) {
          this.items = this.items.slice(0, numberOfGroups);
        }

        // If the array is too short...
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
            });
          }
        }
      },
    },
    items: {
      handler(updatedItems: Item[]): void {
        updatedItems.forEach((updatedItem, index) => {
          if (this.allGroupSettings.length < 0) {
            this.allGroupSettings.push(updatedItem.groupSettings);
          } else {
            this.allGroupSettings[index] = updatedItem.groupSettings;
          }
        });
      },
      deep: true,
    },
  },
});
</script>

<style scoped>

</style>
