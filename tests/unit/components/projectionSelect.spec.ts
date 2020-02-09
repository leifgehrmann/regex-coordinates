import { mount } from '@vue/test-utils';
import ProjectionSelect from '@/components/ProjectionSelect.vue';

describe('ProjectionSelect', () => {
  test('mounts correctly with selected code, and emits with proj4', async () => {
    const wrapper = mount(ProjectionSelect, {
      propsData: {
        selectedEpsgCode: '4326',
        searchInput: '4326',
      },
    });
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted();
    expect(emitted['update:selectedProj4'])
      .toEqual([['+proj=longlat +datum=WGS84 +no_defs']]);
  });

  test('focusin, keydown.enter shows and hides results respectively', async () => {
    const wrapper = mount(ProjectionSelect, {
      propsData: {
        selectedEpsgCode: '4326',
        searchInput: '4326',
      },
    });
    let searchResultsListItem = wrapper.element.getElementsByClassName('search-results-list-item');
    expect(searchResultsListItem).toHaveLength(0);

    // Click on the input field
    const inputField = wrapper.find('.search-input');
    inputField.trigger('focusin');
    await wrapper.vm.$nextTick();

    // Assert that search results appear with at least one result.
    searchResultsListItem = wrapper.element.getElementsByClassName('search-results-list-item');
    expect(searchResultsListItem).toHaveLength(1);

    // Enter key
    inputField.trigger('keydown.enter');
    await wrapper.vm.$nextTick();

    // Assert list items are no longer displayed.
    searchResultsListItem = wrapper.element.getElementsByClassName('search-results-list-item');
    expect(searchResultsListItem).toHaveLength(0);
  });
});
