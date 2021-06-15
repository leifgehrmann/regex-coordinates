/* eslint-disable no-console */
import { mount, Wrapper } from '@vue/test-utils';
import Map from '@/components/Map.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('Map', () => {
  beforeAll(() => {
    wrapper = mount(Map, {
      propsData: {
        geoJson: '',
      },
    });
  });

  test('mounts correctly', async () => {
    await wrapper.vm.$nextTick();
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
