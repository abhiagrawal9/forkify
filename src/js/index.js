import Search from './models/Search';
import * as searchView from './views/seachView'
import { elements, renderLoader, clearLoader } from './views/base';

/**
 * - Search object
 * - Recipe object
 * - Shopping List object
 * - Liked recipes
 **/
const state = {};

const controlSearch = async () => {
    // get the query from view
    const query = searchView.getInput();

    if (query) {
        // create seach object and save it in state
        state.search = new Search(query);
        // Preapre UI for clearing inout
        searchView.clearInput();
        // Preapre UI for showing loader
        renderLoader(elements.searchListsPage);
        // Preapre UI for clearing search results list
        searchView.clearResults();
        // Search for recipes
        await state.search.getResults();
        // Preapre UI for removing loader
        clearLoader();
        // Render results in the ui
        searchView.renderResults(state.search.result);
    }
}


elements.searchField.addEventListener('submit', (event) => {
    event.preventDefault();
    controlSearch();
});

