import {elements} from './base';


export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = ' ';
export const clearPrevSearch = () => elements.searchResultList.innerHTML = " ";
export const limitOverviewText = (text,limit = 120) => {
    let newArr = [];
   if(text.length > limit) {
        text.split(' ').reduce((acc,curr) => {
    
    if(acc + curr.length <=  limit){
        newArr.push(curr)
    }
    return acc + curr.length;
   },0);
   return `${newArr.join(' ')} ... `
   }
   return text;
}
const createButton = (page,type) => {
    const buttonMarkup = `
    <button class="btn-inline results__btn--${type === 'prev' ? 'prev' : 'next'}">
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    <span>Page ${type = 'prev' ? page - 1 : page + 1}</span>
   </button>
    `
    
}

const renderButtons = (page, numResults, resPerPage = 5) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if(page  === 1 && page < pages) {
        button = createButton(page, 'next')
    } 
    else if(page === pages && page !== 1) {
     button = createButton(page,'prev')
    } else {
        button = createButton(page,'prev')
        button = createButton(page,'next')
    }
    elements.searchResPages.insertAdjacentHTML('beforeend',button)

}



export const renderMovie = (results) => {
    const markup = `
    <li>
    <a class="results__link results__link--active" href="#23456">
        <figure class="results__fig">
            <img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2${results.poster_path}' alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${results.original_title}</h4>
            <p class="results__author">${limitOverviewText(results.overview)}</p>
        </div>
    </a>
</li>
 `;
 console.log()
 elements.searchResultList.insertAdjacentHTML('afterend', markup);
}

export const renderResults = (results, page = 1, resPerPage = 5) => {
    // render results of current page and rander the buttons 
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    results.slice(start,end).forEach(renderMovie);
   renderButtons(page,results.length,resPerPage)
}