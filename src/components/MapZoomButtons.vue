<template>
  <div class="flex flex-col text-base shadow rounded-md">
    <button @click="$emit('zoomIn')">
      <font-awesome-icon icon="plus" />
    </button>
    <button @click="$emit('zoomOut')">
      <font-awesome-icon icon="minus" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus);
library.add(faMinus);

export default Vue.extend({
  name: 'MapZoomButtons',
  components: {
    FontAwesomeIcon,
  },
});
</script>

<style scoped>
button {
  background-color: #FFF;
  border-radius: 4px;
  padding: 5px 10px;
}

button:first-child {
  border-radius: 4px 4px 0 0;
}

button:last-child {
  border-bottom: 0;
  border-radius: 0 0 4px 4px;
}

@media (prefers-color-scheme: dark) {
  button {
    color: #FFF;
    background-color: #242424;
  }
}
</style>
