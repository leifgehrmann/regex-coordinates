import { mount, Wrapper } from '@vue/test-utils';
import ProjectionSelect from '@/components/ProjectionSelect.vue';

function hasNSearchResultItems(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper: Wrapper<any>,
  expectedResults: number,
): void {
  const results = wrapper.element.getElementsByClassName('search-results-list-item');
  expect(results).toHaveLength(expectedResults);
}

describe('ProjectionSelect', () => {
  const wrapper = mount(ProjectionSelect, {
    propsData: {
      selectedEpsgCode: '4326',
      searchInput: '4326',
    },
  });
  const inputField = wrapper.find('.search-input');

  test('mounts correctly with selected code, and emits with proj4', async () => {
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted();
    expect(emitted['update:selectedProj4'])
      .toEqual([['+proj=longlat +datum=WGS84 +no_defs']]);
  });

  test('focusin, keydown.enter shows and hides results respectively', async () => {
    hasNSearchResultItems(wrapper, 0);

    // Click on the input field
    inputField.trigger('focusin');
    await wrapper.vm.$nextTick();

    // Assert that search results appear with at least one result.
    hasNSearchResultItems(wrapper, 1);

    // Enter key
    inputField.trigger('keydown.enter');
    await wrapper.vm.$nextTick();

    // Assert list items are no longer displayed.
    hasNSearchResultItems(wrapper, 0);
  });

  test('search input changes search results on input', async () => {
    // Click on the input field
    inputField.trigger('focusin');
    await wrapper.vm.$nextTick();

    // Assert that search results appear with at least one result.
    hasNSearchResultItems(wrapper, 1);

    // Change input of search input
    const newSearchInput = 'Norway zone';
    inputField.setValue(newSearchInput);
    await wrapper.vm.$nextTick();

    // Expect emitted value to be new search input
    const emitted = wrapper.emitted();
    expect(emitted['update:searchInput']?.[0][0])
      .toEqual(newSearchInput);
    wrapper.setProps({
      searchInput: newSearchInput,
    });
    await wrapper.vm.$nextTick();

    // Assert that two results appear.
    hasNSearchResultItems(wrapper, 8);
  });
});
