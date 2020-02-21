// https://forkify-api.herokuapp.com/api/search
import Search  from "./models/Search";
import {elements} from "./views/base";
import * as searchView from './views/searchView';
// ANCHOR Global state of the app 
// Search object
// Current recipe object
// Shopping list object
// liked recipe
const state = {}

const controlSearch = async () => {
    //  1) Get the query from the vue
    // const query = 'titanic'; 
    // to do!!!
  const query = searchView.getInput();
  console.log(query)
    if(query) {
        // 2) New search object and add to state
        state.search = new Search(query);
        // 3) prepare the UI for the result 
         searchView.clearPrevSearch();
        searchView.clearInput();
      
        // 4) Search for the movies
        await state.search.getResults();


searchView.renderResults(state.search.results);
        // 5) render results on UI
       console.log(state)
    }
}

elements.searchForm.addEventListener('submit', e => {
    // So the page doesnt reload when we click the button
    e.preventDefault();
    controlSearch();
  
})




