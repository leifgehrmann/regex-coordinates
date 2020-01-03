<template>
  <v-data-table
    :headers="headers"
    :items="items"
    disable-sort
    hide-default-footer
    class="elevation-1"
    dense
  >
    <template v-slot:item.matchedValues="{ item }">
      <v-chip
        v-for="(matchedValue, index) in item.matchedValues"
        :key="index + matchedValue"
        :item="matchedValue"
        :index="index"
        class="mr-2"
        small
      >
        {{ matchedValue }}
      </v-chip>
    </template>
    <template v-slot:item.type="{ item }">
      <MatchGroupTypeSelect
        :value.sync="item.type"
      />
    </template>
    <template v-slot:no-data>
      <v-layout align-center="">
        No groups found
      </v-layout>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import MatchGroupTypeSelect from './MatchGroupTypeSelect.vue';
import MatchGroup from '@/utils/matchGroup';

  interface Item extends MatchGroup {
    type: string | null;
  }

const items: Item[] = [];

export default Vue.extend({
  name: 'MatchGroupOptions',
  components: {
    MatchGroupTypeSelect,
  },
  props: {
    matchGroups: {
      type: Array,
      default: (): MatchGroup[] => [],
    },
  },
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Group No.',
        value: 'groupNumber',
        width: '90px',
        align: 'center',
      },
      {
        text: 'Matched values',
        value: 'matchedValues',
      },
      {
        text: 'Type',
        value: 'type',
        width: '250px',
      },
    ],
    items,
  }),
  computed: {
    matchGroupTypes(): (string | null)[] {
      return this.items.map((item) => item.type);
    },
  },
  watch: {
    matchGroups(matchGroups: MatchGroup[]): void {
      const currentMatchGroupTypes = this.items.map((item) => item.type);

      // Replace the items with the new matchGroup data
      this.items = matchGroups.map((matchGroup) => ({
        groupNumber: matchGroup.groupNumber,
        matchedValues: matchGroup.matchedValues,
        type: null,
      }));

      // Re-Insert the types
      currentMatchGroupTypes.forEach((type: string | null, groupNumber: number) => {
        if (groupNumber >= this.items.length) {
          return;
        }
        this.items[groupNumber].type = type;
      });
    },
  },
});
</script>
