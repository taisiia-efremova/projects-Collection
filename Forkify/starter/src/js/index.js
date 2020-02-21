// https://forkify-api.herokuapp.com/api/search
import Search from "./models/Search";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {
    elements,
    renderLoader,
    clearLoader
} from "./views/base";
import Recipe from './models/Recipe';
// ANCHOR Global state of the app 
// Search object
// Current recipe object
// Shopping list object
// liked recipe
const state = {}

// NOTE Search controller
const controlSearch = async () => {
    //  1) Get the query from the vue
    const query = searchView.getInput();

    // to do!!!

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);
        // 3) prepare the UI for the result

        searchView.clearResults();
        renderLoader(elements.searchRes)
        searchView.clearInput();
        // 4) Search for the recipes
        try {
            await state.search.getResults();

        // 5) render results on UI
        clearLoader();
        searchView.renderResults(state.search.recipes);  
        } catch(err) {
            console.log('hey')
            clearLoader();
        }
      

    }
}

// NOTE Recipe controller
const controlRecipe = async () => {
    // Get the id from the URL
    const id = window.location.hash.replace('#', ' ');
    // console.log(id);

    if (id) {

        //   Prepare UI for the results
        recipeView.clearRecipe();
        state.recipe = new Recipe(id);
        renderLoader(elements.recipe);
        //   Create new recipe object
        try {
            await state.recipe.getRecipe();
            
            // calculate servings and time 
          state.recipe. parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // Render recipe
            clearLoader();
           recipeView.renderRecipe(state.recipe);

            // Get recipe data
        } catch (error) {
            console.log('dnt have any data in controller')
        }


    }

}


elements.searchForm.addEventListener('submit', e => {
    // So the page doesnt reload when we click the button
    e.preventDefault();
    controlSearch();
    controlRecipe()
})



elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
        console.log(goToPage)
    }

})
// how to add eventListeners to the same function
window.addEventListener('hashchange', controlRecipe)
window.addEventListener('load',controlRecipe)

// ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));