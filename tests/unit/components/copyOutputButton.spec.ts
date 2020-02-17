import { mount, Wrapper } from '@vue/test-utils';
import CopyOutputButton from '@/components/CopyOutputButton.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLabel(wrapper: Wrapper<any>): HTMLSpanElement {
  const labels = wrapper.element.getElementsByClassName('copy-output-button-label');
  return labels.item(0) as HTMLSpanElement;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('CopyOutputButton', () => {
  beforeAll(() => {
    wrapper = mount(CopyOutputButton, {
      propsData: {
        value: 'hello world',
      },
    });
  });

  test('mounts correctly and sets width', async () => {
    await wrapper.vm.$nextTick();
    const label = getLabel(wrapper);
    expect(label.style.width).toMatch(/[0-9]+px/);
    expect(label.textContent).toEqual('Copy to clipboard');
  });

  test('copies to clipboard', async () => {
    wrapper.find('.copy-output-button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(getLabel(wrapper).textContent).toEqual('Failed to copy');
    await new Promise((resolve) => setTimeout(() => {
      expect(getLabel(wrapper).textContent).toEqual('Copy to clipboard');
      resolve();
    }, 2500));
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
