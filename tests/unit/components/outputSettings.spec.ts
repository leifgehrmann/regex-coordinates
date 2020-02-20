import { mount, Wrapper } from '@vue/test-utils';
import OutputSettings from '@/components/OutputSettings.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('OutputSettings', () => {
  beforeAll(() => {
    wrapper = mount(OutputSettings, {
      propsData: {
        // Todo: test actual prop data
      },
    });
  });

  test('mounts with no errors', async () => {
    await wrapper.vm.$nextTick();
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
