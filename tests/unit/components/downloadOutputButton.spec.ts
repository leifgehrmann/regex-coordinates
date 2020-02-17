import { mount, Wrapper } from '@vue/test-utils';
import DownloadOutputButton from '@/components/DownloadOutputButton.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('CopyOutputButton', () => {
  beforeAll(() => {
    wrapper = mount(DownloadOutputButton, {
      propsData: {
        value: 'hello world',
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
