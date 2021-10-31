/* eslint-disable no-console */
import { mount, Wrapper } from '@vue/test-utils';
import MapData from '@/components/MapData.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('MapData', () => {
  beforeAll(() => {
    wrapper = mount(MapData, {
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
