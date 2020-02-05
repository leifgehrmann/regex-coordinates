<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      absolute
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
          <p class="subtitle-1">
            A tool to quickly convert non-standard coordinate data into GeoJSON.
          </p>
          <h2>Step 1. Regular Expression</h2>
          <p class="body-2">
            Create a regular expression pattern with at least two
            <a href="https://www.regular-expressions.info/brackets.html">capture groups</a> for
            the X and Y coordinates. Use <a href="https://regex101.com">regex101.com</a> to
            help with creating the expression.
            <strong>Note:</strong> Only the JavaScript Regex Engine is supported for now.
          </p>
          <RegexInput
            :value.sync="regex"
            :flags.sync="regexFlags"
            :error.sync="regexHasError"
          />

          <h2>Step 2. Input data</h2>
          <DataInput
            :regex-string="!regexHasError ? regex : null"
            :regex-flags-string="regexFlagsString"
            :value.sync="data"
          />

          <h2>Step 3. Projection Settings</h2>
          <p class="body-2">
            Select the map projection the input data is in.
            By default, we assume it is latitude/longitude (WGS 84).
            Search <a href="https://epsg.io">epsg.io</a> for information on
            other projection systems.
          </p>
          <ProjectionSelect
            :epsg.sync="projectionEpsg"
            :proj4.sync="projectionProj4"
          />

          <h2>Step 4. Capture Group Settings</h2>
          <p class="body-2">
            For each capture group in the regular expression, select the appropriate type.
          </p>
          <div class="horizontally-scroll-container">
            <GroupSettingsTable
              :regex-string="!regexHasError ? regex : null"
              :regex-match-all-result="allMatchGroupsResult"
              :all-group-settings.sync="allGroupSettings"
            />
          </div>

          <h2>Output</h2>
          <p class="body-2">
            Copy and paste the output into any GeoJSON viewer. For example,
            <a href="http://geojson.io">geojson.io</a>
          </p>
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
import ProjectionSelect from './components/ProjectionSelect.vue';
import GroupSettingsTable from './components/GroupSettingsTable.vue';
import GeoJsonOutput from './components/GeoJsonOutput.vue';
import Parser from '@/utils/parser';
import GeoJsonGenerator from '@/utils/geoJsonGenerator';
import GroupSettings from '@/utils/groupSettings';
import RegExpFlagsConfig from '@/utils/regExpFlagsConfig';
import regExpFlagsFormatter from '@/utils/regExpFlagsFormatter';

export default Vue.extend({
  name: 'App',

  components: {
    RegexInput,
    DataInput,
    ProjectionSelect,
    GroupSettingsTable,
    GeoJsonOutput,
  },

  data: () => ({
    regex: '',
    regexFlags: {
      global: true,
      multiline: true,
      insensitive: false,
      singleline: false,
      unicode: false,
      sticky: false,
    } as RegExpFlagsConfig,
    regexHasError: false,
    data: '',
    projectionEpsg: '',
    projectionProj4: '',
    parser: new Parser(),
    parsedData: [] as RegExpMatchArray[],
    allMatchGroupsResult: [] as string[][],
    allGroupSettings: [] as GroupSettings[],
    geoJson: '',
  }),
  computed: {
    regexFlagsString(): string {
      return regExpFlagsFormatter(this.regexFlags);
    },
  },

  watch: {
    regex(newVal: string): void {
      this.parser.setRegexFromString(newVal, this.regexFlagsString);
      this.updateEverything();
    },
    regexFlagsString(newVal: string): void {
      this.parser.setRegexFromString(this.regex, newVal);
      this.updateEverything();
    },
    data(): void {
      this.updateEverything();
    },
    allGroupSettings: {
      handler(): void {
        this.updateEverything();
      },
      deep: true,
    },
  },

  created() {
    this.initialize();
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
      this.projectionEpsg = 'EPSG:4326';
      this.allGroupSettings = [
        { type: null },
        { type: null },
        { type: 'latitude' },
        { type: 'longitude' },
      ];
    },
    updateEverything(): void {
      this.parsedData = this.parser.parse(this.data);
      this.allMatchGroupsResult = this.parsedData;
      this.geoJson = GeoJsonGenerator.generate(this.parsedData, this.allGroupSettings);
    },
  },
});
</script>

<style>
h2 {
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.horizontally-scroll-container {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
