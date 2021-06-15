import Vue, { VNode } from 'vue';
import App from './App.vue';
import './index.css';

Vue.config.productionTip = false;

new Vue({
  render: (h): VNode => h(App),
}).$mount('#app');
