<template>
  <div class="app w-max-full md:h-screen flex flex-col md:flex-row static">
    <div class="h-full w-full md:w-1/2">
      <header>
        <img
          alt="Regex-Coordinates Logo"
          src="/icon-white.svg"
          class="w-8 mr-4 static overflow-hidden max-w-full flex"
        >
        <div class="text-xl leading-normal overflow-hidden overflow-ellipsis whitespace-nowrap p-3">
          Regex-Coordinates
        </div>
        <div class="flex-grow" />
        <a
          href="https://github.com/leifgehrmann/regex-coordinates"
          target="_blank"
          class="text-white p-4 whitespace-nowrap leading-loose font-medium tracking-wider text-sm"
        >
          <span class="inline-block uppercase pr-2">
            GitHub
          </span>
          <font-awesome-icon icon="external-link-alt" />
        </a>
      </header>

      <div class="p-4">
        <!--xs12 -->
        <div>
          <p class="subtitle-1">
            A tool to quickly convert non-standard coordinate data into GeoJSON.
          </p>
          <div class="rounded-md bg-blue-100 dark:bg-blue-900 p-3 flex flex-col sm:flex-row md:flex-col lg:flex-row">
            <p class="flex-grow pb-2 sm:py-2 md:pt-0 lg:py-2 m-0 text-blue-900 dark:text-white">
              Want a basic example to see how everything works?
            </p>
            <button
              class="rounded bg-blue-500 text-white p-2 px-4 whitespace-nowrap"
              @click="loadExample"
            >
              Load Example
            </button>
          </div>
          <h2 class="font-bold">Step 1. Regular Expression</h2>
          <p class="body-2">
            Create a regular expression pattern with at least two
            <a
              href="https://www.regular-expressions.info/brackets.html"
              target="_blank"
            >
              capture groups
              <font-awesome-icon icon="external-link-alt" />
            </a> for
            the X and Y coordinates. Use
            <a
              href="https://regex101.com"
              target="_blank"
            >
              regex101.com
              <font-awesome-icon icon="external-link-alt" />
            </a>
            to help with creating the expression.
            <strong>Note:</strong> Only the JavaScript Regex Engine is supported for now.
          </p>
          <RegexInput
            :value.sync="regex"
            :flags.sync="regexFlags"
            :error.sync="regexHasError"
          />

          <h2 class="font-bold">Step 2. Input data</h2>
          <DataInput
            :regex-string="!regexHasError ? regex : null"
            :regex-flags-string="regexFlagsString"
            :value.sync="data"
          />

          <h2 class="font-bold">Step 3. Projection Settings</h2>
          <p class="body-2">
            Select the map projection the input data is in.
            By default, we assume it is latitude/longitude (WGS 84).
            Search
            <a
              href="https://epsg.io"
              target="_blank"
            >
              epsg.io
              <font-awesome-icon icon="external-link-alt" />
            </a>
            for information on other projection systems.
          </p>
          <ProjectionSelect
            :selected-epsg-code.sync="projectionEpsgCode"
            :selected-proj4.sync="projectionProj4"
            :search-input.sync="projectionSearchInput"
          />

          <h2 class="font-bold">Step 4. Capture Group Settings</h2>
          <p class="body-2">
            For each capture group in the regular expression, select the appropriate type.
            A custom type can be made by entering your own value in the field.
          </p>
          <div class="horizontally-scroll-container shadow-md rounded-md">
            <GroupSettingsTable
              :regex-string="!regexHasError ? regex : null"
              :regex-match-all-result="allMatchGroupsResult"
              :is-wgs84="projectionEpsgCode === '4326'"
              :all-group-settings.sync="allGroupSettings"
            />
          </div>

          <h2 class="font-bold">Step 5. Output Settings</h2>
          <p class="body-2">
            Select whether or not the output should consist of points, linestrings, or both.
          </p>
          <OutputSettings
            :all-group-settings="allGroupSettings"
            :feature-type.sync="outputSettingsFeatureType"
            :group-by.sync="outputSettingsGroupBy"
            :order-by.sync="outputSettingsOrderBy"
          />
        </div>
      </div>
    </div>
    <div class="h-full md:w-1/2 md:fixed md:right-0 static">
      <!--<h2>Output</h2>
      <p class="body-2">
        Copy and paste the output into any GeoJSON viewer. For example,
        <a
            href="http://geojson.io"
            target="_blank"
        >
          geojson.io
          <font-awesome-icon icon="external-link-alt" />
        </a>
      </p>
      -->
      <Map :geo-json="geoJson" />
    </div>
  </div>
</template>

<script lang="ts">
import proj4 from 'proj4';
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Parser from '@/utils/parser';
import GeoJsonGenerator from '@/utils/geoJsonGenerator';
import GroupSettings from '@/utils/groupSettings';
import RegExpFlagsConfig from '@/utils/regExpFlagsConfig';
import regExpFlagsFormatter from '@/utils/regExpFlagsFormatter';
import OutputSettings from '@/components/OutputSettings.vue';
import GroupSettingsTable from './components/GroupSettingsTable.vue';
import ProjectionSelect from './components/ProjectionSelect.vue';
import DataInput from './components/DataInput.vue';
import RegexInput from './components/RegexInput.vue';
import Map from './components/Map.vue';

library.add(faExternalLinkAlt);

export default Vue.extend({
  name: 'App',

  components: {
    RegexInput,
    DataInput,
    ProjectionSelect,
    GroupSettingsTable,
    OutputSettings,
    Map,
    FontAwesomeIcon,
  },

  data: () => ({
    regex: '',
    regexFlags: {
      global: false,
      multiline: false,
      insensitive: false,
      singleline: false,
      unicode: false,
      sticky: false,
    } as RegExpFlagsConfig,
    regexHasError: false,
    data: '',
    projectionEpsgCode: '',
    projectionProj4: '',
    projectionSearchInput: '',
    parser: new Parser(),
    parsedData: [] as RegExpMatchArray[],
    allMatchGroupsResult: [] as string[][],
    allGroupSettings: [] as GroupSettings[],
    outputSettingsFeatureType: '',
    outputSettingsGroupBy: '',
    outputSettingsOrderBy: '',
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
    projectionProj4(): void {
      this.updateEverything();
    },
    outputSettingsFeatureType(): void {
      this.updateEverything();
    },
    outputSettingsGroupBy(): void {
      this.updateEverything();
    },
    outputSettingsOrderBy(): void {
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
      this.projectionEpsgCode = '4326';
      this.projectionSearchInput = '4326';
      this.outputSettingsFeatureType = 'both';
      this.regexFlags = {
        global: true,
        multiline: true,
        insensitive: false,
        singleline: false,
        unicode: false,
        sticky: false,
      };
    },
    loadExample(): void {
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
| Bob   | 2020-03-26T09:46:18 | 55.07023 | -3.60332  |
+-------+---------------------+----------+-----------+`;
      this.allGroupSettings = [
        { type: 'custom:name' },
        { type: 'custom:time' },
        { type: 'y' },
        { type: 'x' },
      ];
      this.projectionEpsgCode = '4326';
      this.projectionSearchInput = '4326';
      this.regexFlags = {
        global: true,
        multiline: true,
        insensitive: false,
        singleline: false,
        unicode: false,
        sticky: false,
      };
      this.outputSettingsFeatureType = 'both';
      this.outputSettingsGroupBy = 'custom:name';
      this.outputSettingsOrderBy = 'custom:time';
    },
    updateEverything(): void {
      this.parsedData = this.parser.parse(this.data);
      this.allMatchGroupsResult = this.parsedData;
      if (this.projectionProj4 === '') {
        this.geoJson = 'Please select a projection in the settings. For example: EPSG:4326';
        return;
      }
      const projection = proj4(this.projectionProj4);
      this.geoJson = GeoJsonGenerator.generate(
        this.parsedData,
        this.allGroupSettings,
        projection,
        this.outputSettingsFeatureType,
        this.outputSettingsGroupBy,
        this.outputSettingsOrderBy,
      );
    },
  },
});
</script>

<style>
.horizontally-scroll-container {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (prefers-color-scheme: dark) {

}
</style>
