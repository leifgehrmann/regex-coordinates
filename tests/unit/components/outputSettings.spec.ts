import { mount, Wrapper } from '@vue/test-utils';
import OutputSettings from '@/components/OutputSettings.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: Wrapper<any>;

describe('OutputSettings', () => {
  beforeAll(() => {
    wrapper = mount(OutputSettings, {
      propsData: {
        allGroupSettings: [
          { type: 'x' },
          { type: 'y' },
          { type: 'custom:Alpha' },
          { type: 'custom:Beta' },
        ],
        featureType: 'points',
        groupBy: '',
        orderBy: '',
      },
      attachToDocument: true,
    });
  });

  test('mounts with no errors, and emits featureType', async () => {
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted();
    expect(emitted['update:featureType'][0])
      .toEqual(['points']);
  });

  test('group settings are not visible for Point featureTypes', async () => {
    expect(wrapper.find('.group-settings').isVisible()).toBe(false);
  });

  test('clicking featureType option Both will emit new featureType value', async () => {
    wrapper.find('label[for="both"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Assert an emit happened
    const emitted = wrapper.emitted();
    expect(emitted['update:featureType'][1]).toEqual(['both']);
  });

  test('updating featureType to Both display group settings', async () => {
    wrapper.setProps({ featureType: 'both' });
    await wrapper.vm.$nextTick();

    // Assert the groupSettings element is displayed
    expect(wrapper.find('.group-settings').isVisible()).toBe(true);

    // Assert that the correct groupBy/orderBy options appear in the right order
    const groupByOptions = wrapper.find('#group-by').findAll('option');
    expect(groupByOptions.at(1).text()).toEqual('Alpha');
    expect(groupByOptions.at(2).text()).toEqual('Beta');

    const orderByOptions = wrapper.find('#order-by').findAll('option');
    expect(orderByOptions.at(1).text()).toEqual('Alpha');
    expect(orderByOptions.at(2).text()).toEqual('Beta');
  });

  test('selecting first option in groupBy will emit new value', async () => {
    const groupByOptions = wrapper.find('#group-by').findAll('option');
    groupByOptions.at(1).setSelected();
    await wrapper.vm.$nextTick();

    // Assert an emit happened
    const emitted = wrapper.emitted();
    expect(emitted['update:groupBy'][0]).toEqual(['custom:Alpha']);
  });

  test('selecting second option in orderBy will emit new value', async () => {
    const orderByOptions = wrapper.find('#order-by').findAll('option');
    orderByOptions.at(2).setSelected();
    await wrapper.vm.$nextTick();

    // Assert an emit happened
    const emitted = wrapper.emitted();
    expect(emitted['update:orderBy'][0]).toEqual(['custom:Beta']);
  });

  test('Adding to allGroupSettings does not clear selected groupBy/orderBy', async () => {
    wrapper.setProps({
      allGroupSettings: [
        { type: 'x' },
        { type: 'y' },
        { type: 'custom:Alpha' },
        { type: 'custom:Beta' },
        { type: 'custom:Gamma' },
      ],
    });
    await wrapper.vm.$nextTick();

    // Assert an emit happened
    const emitted = wrapper.emitted();
    expect(emitted['update:groupBy'][1]).toEqual(undefined);
    expect(emitted['update:orderBy'][1]).toEqual(undefined);
  });

  test('Removing from allGroupSettings clears selected groupBy/orderBy', async () => {
    wrapper.setProps({
      allGroupSettings: [
        { type: 'x' },
        { type: 'y' },
      ],
    });
    await wrapper.vm.$nextTick();

    // Assert an emit happened
    const emitted = wrapper.emitted();
    expect(emitted['update:groupBy'][1]).toEqual(['']);
    expect(emitted['update:orderBy'][1]).toEqual(['']);
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
