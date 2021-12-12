import { mount, Wrapper } from '@vue/test-utils';
import copy from 'copy-to-clipboard';
import CopyOutputButton from '@/components/CopyOutputButton.vue';
import { mocked } from 'jest-mock';

jest.mock('copy-to-clipboard');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLabel(wrapper: Wrapper<any>): HTMLSpanElement {
  const labels = wrapper.element.getElementsByClassName('copy-output-button-label');
  return labels.item(0) as HTMLSpanElement;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('CopyOutputButton', () => {
  const mockedCopy = mocked(copy);

  beforeAll(() => {
    mockedCopy.mockClear();
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
    expect(label.textContent).toEqual('Copy GeoJSON');
  });

  test('copies to clipboard, with success', async () => {
    mockedCopy.mockReturnValue(true);
    wrapper.find('.copy-output-button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(mockedCopy).toHaveBeenCalled();
    expect(getLabel(wrapper).textContent).toEqual('Copied!');
    setTimeout(() => {
      expect(getLabel(wrapper).textContent).toEqual('Copy GeoJSON');
    }, 2500);
  });

  test('copies to clipboard, but with error', async () => {
    mockedCopy.mockReturnValue(false);
    wrapper.find('.copy-output-button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(mockedCopy).toHaveBeenCalled();
    expect(getLabel(wrapper).textContent).toEqual('Failed to copy');
    setTimeout(() => {
      expect(getLabel(wrapper).textContent).toEqual('Copy GeoJSON');
    }, 2500);
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
