<template>
  <span>
    <button
      type="button"
      class="text-base shadow"
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
  background-color: white;
  border-radius: 4px;
  padding: 5px 15px;
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
