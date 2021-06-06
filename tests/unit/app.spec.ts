import { shallowMount, Wrapper } from '@vue/test-utils';
import App from '@/App.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('App', () => {
  beforeAll(() => {
    wrapper = shallowMount(App, { });
  });

  test('mounts correctly', async () => {
    await wrapper.vm.$nextTick();
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
