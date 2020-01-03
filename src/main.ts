import Vue, { VNode } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h): VNode => h(App),
}).$mount('#app');
