/* eslint-disable no-console */
import { mount, Wrapper } from '@vue/test-utils';
import RegexFlags from '@/components/RegexFlags.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('RegexFlags', () => {
  beforeAll(() => {
    wrapper = mount(RegexFlags, {
      propsData: {
        flags: {
          global: false,
          multiline: false,
          insensitive: false,
          singleline: false,
          unicode: false,
          sticky: false,
        },
      },
    });
  });

  test('mounts', async () => {
    await wrapper.vm.$nextTick();
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
