export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchField: document.querySelector('.search'),
    searchResultsList: document.querySelector('.results__list'),
    searchListsPage: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list')
}

export const elementsStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
        <div class="${elementsStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementsStrings.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};