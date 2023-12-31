const searchInput = document.getElementById('search-box');
const searchBtn = document.getElementById('submit-btn');
const searchResultsContainer = document.getElementById('search-results-container');
const home = document.getElementById('home');
const favourites = document.getElementById('favourites');
const favouritesContainer = document.getElementById('favourites-container');
const searchForText = document.getElementById('search-for-text');
const resetFavBtn = document.getElementById('reset-btn');
let favoritesList = [];

// When clicked on HOME page will be directed to home page 
home.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();
});

// when clicked on favourites on header will call showFav() func to display/show favourite meals
favourites.addEventListener('click', (e) => {
    showFav();
});

// Button to reset our favourites list by clearing the local storage
resetFavBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear(); // clears the local storage
    alert('All Favourites have been removed..!');
    location.reload();
});

// On click listener on search box button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();

    searchForText.classList.add('hide'); // will hide the 'search for meal' txt when we search a meal
    favouritesContainer.classList.add('hide'); // will hide the 'favourites' container when we search a meal
    favouritesContainer.classList.remove('show-favourites-container');

    if(searchInput.value === '' || searchInput.value === ' '){
        alert('Search for a meal from the search box!');
    } else {
        const searchedMeal = searchInput.value;
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedMeal}`) // fetching details from Meal API
        .then(response => response.json()) // json() method returns a promise converting response from Meal API to json
        .then(data => {
            if (data.meals === null) {
                alert('No meals found for this search query.'); // if no meals is found, send an alert to the user.
            } else {
                displaySearchResults(data.meals); // if meals are found call displaySearchResults() function
            }
        })
        .catch(error => {
            console.error(error); // returns error if Meal api fails
        });
    }

})

function displaySearchResults(meals) {
    searchResultsContainer.innerHTML = '';

    // for each meals received from Meal API will append that to our search result container
    meals.forEach(meal => {

        // creating a div for meal header(Image & Name of the meal)
        const mealHeaderDiv = document.createElement('DIV'); 
        mealHeaderDiv.classList.add('meals-div');

        const mealImg = document.createElement('IMG');
        mealImg.src = meal.strMealThumb;
        mealImg.alt = meal.strMeal;
        mealHeaderDiv.appendChild(mealImg);

        const mealName = document.createElement('P');
        mealName.innerHTML = '<i class="fa-solid fa-bowl-rice"></i> ' + meal.strMeal;
        mealHeaderDiv.appendChild(mealName);
        
        searchResultsContainer.appendChild(mealHeaderDiv); // adding meal header(Image & Name of meal) to search result container

        // creating a div for meal's ingredients & recipe instruction to appending it to the search result container 
        const mealRecipeIngredientDiv = document.createElement('DIV');
        mealRecipeIngredientDiv.classList.add('meal-recipe-ingredient-div');

        searchResultsContainer.appendChild(mealRecipeIngredientDiv);

        // creating meal ingredients div
        const mealIngredientDiv = document.createElement('DIV');
        mealIngredientDiv.classList.add('meal-ingredients-div');
        mealRecipeIngredientDiv.appendChild(mealIngredientDiv);


        const ingredientList = document.createElement('UL'); 
        for(let i = 1; i < 20; i++) {
            // adding each ingredient of the meal to a list item
            if(meal[`strIngredient${i}`]) { 
                let ingredient = meal[`strIngredient${i}`];
                let ingredientMeasure = meal[`strMeasure${i}`];
                const ingredientItems = document.createElement('LI');
                ingredientItems.innerHTML = ingredient + ' - ' + ingredientMeasure;

                ingredientList.appendChild(ingredientItems);
            }
        }
        mealIngredientDiv.appendChild(ingredientList);

        // creating recipe instruction div -> this div will be hidden initially on the page
        const recipeInstructionDiv = document.createElement('DIV');
        recipeInstructionDiv.classList.add('recipe-instructions-div');

        const mealInstructions = document.createElement('P'); // creating a P tag to add meal's recipe instruction
        mealInstructions.classList.add('hide');
        mealInstructions.innerHTML = meal.strInstructions;

        recipeInstructionDiv.appendChild(mealInstructions);
        mealRecipeIngredientDiv.appendChild(recipeInstructionDiv);
        
        const readAndFavDiv = document.createElement('DIV');
        searchResultsContainer.appendChild(readAndFavDiv);

        // creating a Read More button to show meal's recipe instruction when clicked
        const readMore = document.createElement('a');
        readMore.classList.add('read-more');
        readMore.innerHTML = 'Read More <i class="fa-solid fa-caret-down fa-rotate-270"></i>';
        readAndFavDiv.appendChild(readMore);        

        // creating a button to add meal to our Favourites when clicked
        const addToFav = document.createElement('button'); 
        addToFav.classList.add('add-fav');
        addToFav.innerHTML = '<i class="fa-solid fa-heart-circle-plus fa-bounce"></i> Add To Favourites';
        readAndFavDiv.appendChild(addToFav);

        // when Read More button is clicked it will show a DIV containing the meal's recipe instructions
        readMore.addEventListener('click', (e) => {     
            e.preventDefault();
            mealInstructions.classList.toggle('showInstructions');
            recipeInstructionDiv.classList.toggle('show');
            mealIngredientDiv.classList.toggle('meal-ingredients-div-toggle');
        })

        addToFav.addEventListener('click', (e) => {   
            e.preventDefault();
            // when "Add To Favourites" is clicked, meal will be sent to addFavourites() func to add that meal to our local storage myFavList
            addFavourites(meal);
            
            // disable the "Add To Favourites" button once meal is added to our favourites & change the innerhtml text.
            addToFav.setAttribute('disabled', 'disabled');
            addToFav.innerHTML = '<i class="fa-solid fa-heart-circle-check"></i> Added To Favourites';
            addToFav.classList.remove('add-fav');
            addToFav.classList.add('disabled');

            // alert the user that the meal has been added to favourites
            alert(`${meal.strMeal} has been added to your favorites.`);
        })

        const divider = document.createElement('DIV');      // creating a divider to divide list of meals on a web page
        divider.classList.add('meals-divider');
        searchResultsContainer.appendChild(divider);
        
    });
}


// function to add the sent meal to our favourites using local storage
function addFavourites(meal) {

    const favMeal = document.createElement('DIV');

    const mealHeaderDiv = document.createElement('DIV'); // meal header(image & name of the meal)
    mealHeaderDiv.classList.add('meals-div');
    
    const mealImg = document.createElement('IMG');
    mealImg.src = meal.strMealThumb;
    mealImg.alt = meal.strMeal;
    mealHeaderDiv.appendChild(mealImg);
    
    const mealName = document.createElement('P');
    mealName.innerHTML = meal.strMeal;
    mealHeaderDiv.appendChild(mealName);
            
    favMeal.appendChild(mealHeaderDiv);
    
    // creating a div for meal's recipe & ingredients and appending it to search result container 
    const mealRecipeIngredientDiv = document.createElement('DIV'); 
    mealRecipeIngredientDiv.classList.add('meal-recipe-ingredient-div');
    
    favMeal.appendChild(mealRecipeIngredientDiv);
    
    const mealIngredientDiv = document.createElement('DIV');
    mealIngredientDiv.classList.toggle('meal-ingredients-div-toggle');

    mealRecipeIngredientDiv.appendChild(mealIngredientDiv);
    
    const ingredientList = document.createElement('UL');
    for(let i = 1; i < 20; i++) {
        // adding each ingredient of the meal to a list item
        if(meal[`strIngredient${i}`]) {     
            let ingredient = meal[`strIngredient${i}`];
            let ingredientMeasure = meal[`strMeasure${i}`];
            const ingredientItems = document.createElement('LI');
            ingredientItems.innerHTML = ingredient + ' - ' + ingredientMeasure;
            ingredientList.appendChild(ingredientItems);
        }
    }
    mealIngredientDiv.appendChild(ingredientList);
    
    // recipe instructions div
    const recipeInstructionDiv = document.createElement('DIV');
    recipeInstructionDiv.classList.add('recipe-instructions-div');
    recipeInstructionDiv.classList.add('show');
    
    const mealInstructions = document.createElement('P');   // creating a P tag to add meal's recipe instruction
    mealInstructions.classList.add('showInstructions');
    mealInstructions.innerHTML = meal.strInstructions;
    recipeInstructionDiv.appendChild(mealInstructions);
    mealRecipeIngredientDiv.appendChild(recipeInstructionDiv);
    
    // creating a remove button to delete a meal permanently from favourites when clicked
    const removeButton = document.createElement('button');  // remove function will be handled from showFav()
    removeButton.classList.add('delete-fav');
    removeButton.innerHTML = ' <i class="fa-solid fa-heart-circle-minus fa-fade"></i> Remove from Favorites';
    favMeal.appendChild(removeButton);

    const divider = document.createElement('DIV');
    divider.classList.add('meals-divider');
    favMeal.appendChild(divider);

    favouritesContainer.appendChild(favMeal);

    saveData();  // save meal to the local storage
}


// function to show favourites when clicked on Favourites from the header
function showFav() {
    searchForText.classList.add('hide'); // hide 'Search for a meal' txt when showing Favourites container

    // if local storage item 'fav' is empty then alert user that there are no favourites
    if(localStorage.length === 0 || localStorage.getItem('myFavList').length < 100) {
        location.reload();
        alert("No Favourite Meals found..!");        
    }

    // empty the search result container while showing favourites container
    searchResultsContainer.innerHTML = ''; 
    favouritesContainer.classList.add('show-favourites-container');

    // fetching favourites from local storage and adding it into favouritesContainer's innerHTML
    favouritesContainer.innerHTML = localStorage.getItem("myFavList");

    // Deleting a meal from favourites
    favouritesContainer.addEventListener('click', (e) => {
        e.preventDefault();
        if(e.target.tagName == "BUTTON"){
            removeFromFavorites(e);
        }        
    })
}


// function to remove favourite meal from Favourites
function removeFromFavorites(e) {
    e.target.parentElement.remove();
    alert('Meal removed from favourites!');
    favoritesList = [];
    saveData();      // after removing a meal from favourites update the data to the local storage
}


// function to save data to local storage, to be able to load the data into webpage even afer page reload/refresh.
function saveData() {
    localStorage.setItem("myFavList", favouritesContainer.innerHTML);
}