<template>
  <span>
    <button
      class="copy-output-button"
      @click="copyToClipboard"
    >
      <font-awesome-icon
        :icon="icon"
      />
      <span class="copy-output-button-label">{{ labelText }}</span>
    </button>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import copy from 'copy-to-clipboard';

library.add(faCopy);
library.add(faCheck);
library.add(faExclamationCircle);

export default Vue.extend({
  name: 'CopyOutputButton',
  components: {
    FontAwesomeIcon,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    icon: 'copy',
    labelText: 'Copy to clipboard',
  }),
  mounted(): void {
    const labels = this.$el.getElementsByClassName('copy-output-button-label');
    const label = labels.item(0) as HTMLSpanElement;
    // Add +1 to work around glitchy text resizing when changing the label.
    label.style.width = `${label.offsetWidth + 1}px`;
  },
  methods: {
    copyToClipboard(): void {
      try {
        const success = copy(this.value);
        if (success) {
          this.icon = 'check';
          this.labelText = 'Copied!';
        } else {
          this.displayError();
        }
      } catch (e) {
        this.displayError();
      }
      setTimeout(() => {
        this.icon = 'copy';
        this.labelText = 'Copy to clipboard';
      }, 2 * 1000);
    },
    displayError(): void {
      this.icon = 'exclamation-circle';
      this.labelText = 'Failed to copy';
    },
  },
});
</script>

<style scoped>
button {
  background-color: #FFF;
  border-radius: 4px;
  padding: 5px 15px;
  margin: 10px 10px 10px 0;
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.copy-output-button-label {
  display: inline-block;
  box-sizing: content-box;
  padding: 0;
  margin: 0;
  border: none;
}

.copy-output-button-success {

}

.svg-inline--fa {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

@media (prefers-color-scheme: dark) {
  button {
    background-color: #242424;
  }
}
</style>
