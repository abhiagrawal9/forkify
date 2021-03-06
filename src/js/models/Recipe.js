import axios from 'axios';

export default class Recipe {
  constructor(recipeID) {
    this.recipeID = recipeID;
  }

  async getRecipe() {
    try {
      const recipe = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.recipeID}`
      );
      this.title = recipe.data.recipe.title;
      this.author = recipe.data.recipe.publisher;
      this.img = recipe.data.recipe.image_url;
      this.url = recipe.data.recipe.source_url;
      this.ingredients = recipe.data.recipe.ingredients;
    } catch (err) {
      console.log(err);
      alert('Something went wrong!!');
    }
  }

  calcTime() {
    // Assuming that we need 15 min for 3 ingredients
    const numOfIng = this.ingredients.length;
    const periods = Math.ceil(numOfIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4; // Hard coding and assuming for every recipe it is 4
  }

  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map((el) => {
      // 1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3) Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        // Ex. 4 1/2 cups sauce
        // arrCount is [4, 1 / 2] --> eval("4+1/2") --> 4.5
        // Ex. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is NO unit, but 1st element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        // There is NO unit and NO number in 1st position
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // update the servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // update the ingredients
    this.ingredients.forEach((curIng) => {
      curIng.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
