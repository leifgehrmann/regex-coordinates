import { mount, Wrapper } from '@vue/test-utils';
import FeatureTypeGraphic from '@/components/FeatureTypeGraphic.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('FeatureTypeGraphic', () => {
  beforeAll(() => {
    wrapper = mount(FeatureTypeGraphic, {
      propsData: {
        featureType: 'points',
        selected: true,
      },
    });
  });

  test('mounts with no errors', async () => {
    await wrapper.vm.$nextTick();
  });

  test('featureType can be switched', async () => {
    wrapper.setProps({
      featureType: 'linestring',
    });
    await wrapper.vm.$nextTick();
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
