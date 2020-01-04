<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-img
        alt="Regex-Coordinates Logo"
        src="../public/icon-white.svg"
        class="shrink v-responsive"
        style="width: 32px; margin-right:16px;"
      />
      <v-toolbar-title>Regex-Coordinates</v-toolbar-title>
      <v-spacer />
      <v-btn
        href="https://github.com/leifgehrmann/regex-coordinates"
        target="_blank"
        text
      >
        <span class="mr-2">GitHub</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-flex xs12>
          <RegexInput :value.sync="regex" />
          <DataInput :value.sync="data" />
          <GroupSettingsTable
            :regex="regex"
            :matches="matchGroups"
          />
          <MatchGroupOptions
            ref="matchGroupOptions"
            :match-groups="matchGroups"
          />
        </v-flex>
      </v-container>
      <v-container>
        <v-flex xs12>
          <GeoJsonOutput :value="geoJson" />
        </v-flex>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import RegexInput from './components/RegexInput.vue';
import DataInput from './components/DataInput.vue';
import GroupSettingsTable from './components/GroupSettingsTable.vue';
import MatchGroupOptions from './components/MatchGroupOptions.vue';
import GeoJsonOutput from './components/GeoJsonOutput.vue';
import Parser from '@/utils/parser';
import MatchGroupTransformer from '@/utils/matchGroupTransformer';
import GeoJsonGenerator from '@/utils/geoJsonGenerator';
import MatchGroup from '@/utils/matchGroup';

const parser = new Parser();
const matchGroupTransformer = new MatchGroupTransformer();
const parsedData: string[][] = [];
const matchGroups: MatchGroup[] = [];

export default Vue.extend({
  name: 'App',

  components: {
    RegexInput,
    DataInput,
    GroupSettingsTable,
    MatchGroupOptions,
    GeoJsonOutput,
  },

  data: () => ({
    regex: '',
    data: '',
    parsedData,
    matchGroups,
    matchGroupTypes: [],
    groupSettings: [],
    geoJson: '',
  }),

  watch: {
    regex(newVal: string): void {
      parser.setRegexFromString(newVal);
      this.updateParsedData();
    },
    data(): void {
      this.updateParsedData();
    },
  },

  created() {
    this.initialize();
  },
  mounted() {
    this.$watch(
      '$refs.matchGroupOptions.matchGroupTypes',
      (newValue) => {
        this.matchGroupTypes = newValue;
        this.updateGeoJson();
      },
    );
  },

  methods: {
    initialize(): void {
      this.regex = '\\| ([^|]*) \\| ([^|]*) \\| ([-0-9. ]*) \\| ([-0-9. ]*) \\|';
      this.data = `+-------+---------------------+----------+-----------+
| Name  | Arrival Time        | Latitude | Longitude |
+-------+---------------------+----------+-----------+
| Alice | 2020-03-21T13:52:12 | 55.85450 | -4.24621  |
| Alice | 2020-03-21T13:52:12 | 55.95073 | -3.18603  |
| Alice | 2020-03-23T14:28:12 | 57.14443 | -2.09564  |
| Alice | 2020-03-29T18:47:23 | 57.48040 | -4.22973  |
| Bob   | 2020-03-20T19:47:23 | 56.81699 | -5.11194  |
| Bob   | 2020-03-22T19:26:42 | 56.11799 | -3.93653  |
| Bob   | 2020-03-26T09:46:18 | 55.45705 | -4.63623  |
+-------+---------------------+----------+-----------+`;
    },
    updateParsedData(): void {
      this.parsedData = parser.parse(this.data);
      this.matchGroups = matchGroupTransformer.transform(this.parsedData);
    },
    updateGeoJson(): void {
      this.geoJson = GeoJsonGenerator.generate(this.parsedData, this.matchGroupTypes);
    },
  },
});
</script>
