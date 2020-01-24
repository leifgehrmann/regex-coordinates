<template>
  <div>
    <div
      @click="showDropdown = !showDropdown"
    >
      gmiyus
    </div>
    <div
      v-if="showDropdown"
      class="dropdown"
      @click="showDropdown = false"
    >
      <ul>
        <li><span>g</span>lobal</li>
        <li><span>i</span>nsensitive</li>
        <li><span>m</span>ultiline</li>
        <li><span>s</span>ingleline</li>
        <li><span>u</span>nicode</li>
        <li>stick<span>y</span></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'RegexFlags',
  data: () => ({
    showDropdown: true,
  }),
});
</script>

<style scoped>
.dropdown {
  border: 1px solid #000;
  background: #FFF;
  padding: 5px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
  0 2px 2px 0 rgba(0, 0, 0, 0.14),
  0 1px 5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: absolute;
  z-index: 10;
}
.dropdown ul li span {
  font-weight: bold;
  color: #0074D9;
}
@media (prefers-color-scheme: dark) {
  .dropdown {
    border: 1px solid #FFF;
    background: #000;
  }
  .dropdown ul li span {
    color: #AAEEFF;
  }
}
</style>
