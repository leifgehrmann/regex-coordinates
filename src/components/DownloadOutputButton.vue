<template>
  <span>
    <button
      @click="download"
    >
      <font-awesome-icon
        icon="file-download"
      />
      Download GeoJSON
    </button>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import FileSaver from 'file-saver';

library.add(faFileDownload);

export default Vue.extend({
  name: 'DownloadOutputButton',
  components: {
    FontAwesomeIcon,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    download(): void {
      const blob = new Blob([this.value], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(blob, 'file.geojson');
    },
  },
});
</script>

<style scoped>
button {
  border: 0;
  font-size: 16px;
  background-color: #FFF;
  border-radius: 4px;
  padding: 5px 15px;
  margin: 10px 10px 10px 0;
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.svg-inline--fa {
  margin-right: 10px;
}

@media (prefers-color-scheme: dark) {
  button {
    color: #FFF;
    background-color: #242424;
  }
}
</style>
