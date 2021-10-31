<template>
  <div class="h-96 md:min-h-0 md:h-full">
    <l-map
      ref="leafletMap"
      :zoom="zoom"
      :center="center"
      :options="{zoomControl: false}"
      class="h-full"
      @ready="onReady()"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-control :position="'topleft'">
        <MapZoomButtons
          v-if="isValidGeoJson"
          @zoomIn="zoomIn"
          @zoomOut="zoomOut"
        />
      </l-control>
      <l-control>
        <div
          v-if="isValidGeoJson"
          class="flex flex-col items-end"
        >
          <div><DownloadOutputButton :value="geoJson" /></div>
          <div class="py-3">
            <CopyOutputButton :value="geoJson" />
          </div>
        </div>
        <div v-else-if="geoJson !== ''">
          <div
            class="
              bg-white dark:bg-black
              text-red-600 text-base dark:text-red-400 font-bold
              p-2 mx-auto ml-3
              radius shadow-md rounded-md
            "
          >
            {{ geoJson }}
          </div>
        </div>
      </l-control>
      <l-geo-json
        :geojson="geoJsonObjectForMap"
        :options="options"
        :options-style="styleFunction"
      />
    </l-map>
  </div>
</template>

<script lang="ts">
import {
  Map,
  GeoJSON,
  Icon,
} from 'leaflet';
import {
  LMap, LTileLayer, LGeoJson, LControl,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import Vue from 'vue';
import { debounce } from 'debounce';
import MapZoomButtons from '@/components/MapZoomButtons.vue';
import DownloadOutputButton from '@/components/DownloadOutputButton.vue';
import CopyOutputButton from '@/components/CopyOutputButton.vue';

type D = Icon.Default & {
  _getIconUrl?: string;
};

// eslint-disable-next-line no-underscore-dangle
delete (Icon.Default.prototype as D)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon@2x.png',
  iconUrl: '/marker-icon.png',
  shadowRetinaUrl: '/marker-shadow@2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [18, 26],
  shadowSize: [9, 11],
  iconAnchor: [9, 26],
  shadowAnchor: [0, 11],
});

export default Vue.extend({
  name: 'MapData',
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    LControl,
    MapZoomButtons,
    DownloadOutputButton,
    CopyOutputButton,
  },
  props: {
    geoJson: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    zoom: 2,
    center: [0, 0],
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    geoJsonWatchEventHandler: (): void => { /* do nothing */ },
    map: null as Map|null,
  }),
  computed: {
    geoJsonObjectForMap(): Record<string, unknown> {
      if (this.geoJsonObject === null) {
        return {
          type: 'FeatureCollection',
          features: [],
        };
      }
      return this.geoJsonObject;
    },
    geoJsonObject(): Record<string, unknown>|null {
      try {
        return JSON.parse(this.geoJson);
      } catch (e) {
        return null;
      }
    },
    isValidGeoJson(): boolean {
      return this.geoJsonObject !== null;
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction,
      };
    },
    styleFunction() {
      return () => ({
        weight: 2,
        color: '#000',
        opacity: 0.8,
      });
    },
    onEachFeatureFunction() {
      const str2html = (input: string): string => {
        let output = input.replace(/&/g, '&amp;');
        output = output.replace(/</g, '&lt;');
        output = output.replace(/>/g, '&gt;');
        return output;
      };

      return (feature: {properties: Record<string, string>}, layer: unknown) => {
        let tooltip = '';
        Object.entries(feature.properties).forEach(([key, value]) => {
          tooltip += `<div>${str2html(key)}: ${str2html(value)}</div>`;
        });
        layer.bindTooltip(
          tooltip,
          {
            permanent: false,
            sticky: true,
          },
        );
      };
    },
  },
  watch: {
    geoJson(): void {
      this.geoJsonWatchEventHandler();
    },
  },
  mounted() {
    this.geoJsonWatchEventHandler = debounce(() => {
      this.updateBoundsToFitGeoJson();
    }, 100);
  },
  methods: {
    onReady(): void {
      this.map = this.$refs.leafletMap.mapObject;
      this.updateBoundsToFitGeoJson();
    },
    updateBoundsToFitGeoJson(): void {
      if (!this.isValidGeoJson) {
        return;
      }
      const leafletMapObject = this.map;
      if (leafletMapObject === null) {
        return;
      }

      leafletMapObject.eachLayer((layer) => {
        if (layer instanceof GeoJSON) {
          leafletMapObject.fitBounds(layer.getBounds());
        }
      });
    },
    zoomIn(): void {
      this.map?.zoomIn();
    },
    zoomOut(): void {
      this.map?.zoomOut();
    },
  },
});
</script>
