import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/seachView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { elements, renderLoader, clearLoader } from './views/base';

/**
 * - Search object
 * - Recipe object
 * - Shopping List object
 * - Liked recipes
 **/
const state = {};

/**
 * SEARCH CONTROLLER
 */
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
        try {
            // Search for recipes
            await state.search.getResults();
            // Preapre UI for removing loader
            clearLoader();
            // Render results in the ui
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Spmething went wrong with the search.')
            clearLoader();
        }
    }
};

elements.searchField.addEventListener('submit', (event) => {
    event.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', (event) => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // base 10
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // get the ID from the URL
    const id = window.location.hash.replace('#', '');
    if (id) {
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // highlight the selected search item
        if (state.search) {
            searchView.highlightedSelected(id);
        }

        // create new recipe object
        state.recipe = new Recipe(id);
        try {
            // Get the recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //  calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (err) {
            alert('Error processing recipe.')
        }
    }
};

// How to use same event listeners on mutilpe events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List CONTROLLER
 */
const controlList = () => {
    // Crete a new list if there is no list
    if (!state.list) state.list = new List();

    // Add ingredients to list
    state.recipe.ingredients.forEach(cur => {
        const item = state.list.addItem(cur.count, cur.unit, cur.ingredient);
        // render item in UI
        listView.renderItem(item);
    });
}

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // handle delete event
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);
        // delete from UI
        listView.deleteItem(id);
    }
    // handle the count update
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

// TODO remove line
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

/**
 * Like CONTROLLER
 */
const controlLke = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.recipeID;

    // user has not like current recipe
    if (!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI like list
        likesView.renderLike(newLike);
    }
    // user has liked current recipe
    else {
        // remove like to the state
        state.likes.deleteLike(currentID);
        // toggle the like button
        likesView.toggleLikeBtn(false);
        // remove like to UI like list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

}

// handling rescipe page click controllers
elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.UpdateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.UpdateServingsIngredients(state.recipe)

    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add item to shopping list 
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLke();
    }
});



