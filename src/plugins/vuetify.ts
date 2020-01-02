import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

const vuetify = new Vuetify({
  theme: { dark: mediaQueryList.matches },
});

mediaQueryList.addListener((event) => {
  vuetify.framework.theme.dark = event.matches;
});

export default vuetify;
