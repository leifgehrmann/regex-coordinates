import { mount, Wrapper } from '@vue/test-utils';
import RegexFlags from '@/components/RegexFlags.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('RegexFlags', () => {
  beforeAll(() => {
    wrapper = mount(RegexFlags, {
      propsData: {
        flags: {
          global: true,
          multiline: false,
          insensitive: true,
          singleline: false,
          unicode: true,
          sticky: false,
        },
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
