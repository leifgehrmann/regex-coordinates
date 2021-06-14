/* eslint-disable no-console */
import { shallowMount, Wrapper } from '@vue/test-utils';
import MatchGroupTypeSelect from '@/components/MatchGroupTypeSelect.vue';

function getInputField(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper: Wrapper<any>,
): HTMLInputElement {
  const inputs = wrapper.element.getElementsByClassName('search-input');
  return inputs.item(0) as HTMLInputElement;
}

function getListItem(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper: Wrapper<any>,
  index: number,
): HTMLLIElement {
  const listItems = wrapper.element.getElementsByClassName('search-results-list-item');
  return listItems.item(index) as HTMLLIElement;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('MatchGroupTypeSelect', () => {
  beforeAll(() => {
    wrapper = shallowMount(MatchGroupTypeSelect, {
      propsData: {
        isWgs84: false,
        value: 'x',
      },
      attachTo: document.body,
    });
  });

  test('mounts correctly with selected value', async () => {
    await wrapper.vm.$nextTick();
    expect(getInputField(wrapper).value).toEqual('X Coordinate');
  });

  test('Changes displayed value depending on isWgs84', async () => {
    wrapper.setProps({
      isWgs84: true,
    });
    await wrapper.vm.$nextTick();
    expect(getInputField(wrapper).value).toEqual('Longitude (Decimal)');
  });

  test('Changes displayed value for custom type', async () => {
    wrapper.setProps({
      value: 'custom:My "Custom" Name',
    });
    await wrapper.vm.$nextTick();
    expect(getInputField(wrapper).value).toEqual('Custom: My "Custom" Name');
  });

  test('Focus changes displayed value in input field', async () => {
    wrapper.find('.search-input').trigger('focusin');
    await wrapper.vm.$nextTick();
    expect(getInputField(wrapper).value).toEqual('My "Custom" Name');
  });

  test('entering in input changes UI', async () => {
    wrapper.find('.search-input').setValue('My Other Value');
    await wrapper.vm.$nextTick();
    expect(getInputField(wrapper).value).toEqual('My Other Value');

    const customListItem = getListItem(wrapper, 1);
    if (customListItem.textContent === null) {
      throw new Error('textContent should not be null');
    }
    expect(customListItem.textContent.trim()).toEqual('Custom: My Other Value');
  });

  test('Selecting new input changes UI and emits new value', async () => {
    const customListItem = getListItem(wrapper, 1);
    customListItem.dispatchEvent(new Event('click'));
    await wrapper.vm.$nextTick();
    expect(getInputField(wrapper).value).toEqual('Custom: My Other Value');
    const emitted = wrapper.emitted();
    expect(emitted['update:value'])
      .toEqual([['custom:My Other Value']]);
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
