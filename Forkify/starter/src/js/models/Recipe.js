import axios from 'axios';;

export default class Recipe {
    constructor(id) {
     this.id = id;
     
    }

    async getRecipe(){
    try {
    const res = await axios(`https://forkify-api.herokuapp.com/api/get?&rId=${this.id}`);
    let dataAPI = res.data.recipe
    this.author = dataAPI.publisher;
    this.title = dataAPI.title;
    this.img = dataAPI.image_url;
    this.url = dataAPI.source_url;
    this.ingredients = dataAPI.ingredients;
    
    
    } catch(error) {
        console.log('we have an error with recipe Model')
    }
  

}
calcTime() {
    // Assuming that we need 15 min for each 3 ingredients.
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
}
  calcServings() {
      this.servings = 4;
  }
  parseIngredients() {
      const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon', 'cups','pounds'];
      const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','pound'];
      const units = [...unitsShort, 'kg' , 'g']
      const newIngredients = this.ingredients.map(el => {
        //  1) Uniform Units
         let ingredient = el.toLowerCase();
         unitsLong.forEach((unit,i) => {
             ingredient = ingredient.replace(unit,unitsShort[i])
         })
        // 2) Remove parentheses
        ingredient = ingredient.replace(/ *\([^)]*\) */g, "");
        // 3) Parse ingredients into count, unit and igredient itself
        const arrIng = ingredient.split(' ');
        // checks if each single ingredient in the ingredients array includes a unit measures.
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
        let objIng;
        if(unitIndex > -1) {
            //  there is a unit
            // example 4 1/2 cups a count as [4, 1/2]
            const arrCount = arrIng.slice(0,unitIndex);
            let count;
            if(arrCount.length === 1) {
                count = eval(arrIng[0].replace('-','+'));
            }else {
                count = arrIng.slice(0,unitIndex).join('+')
            }
            objIng = {
                count: count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex + 1).join(' ')
            }

        }else if (parseInt(arrIng[0],10)){ 
            // there is no unit but the first element is a number
            objIng = {
                count: 1,
                unit: '',
                ingredient: arrIng.slice(1).join(' ')
            }
        } else if(unitIndex === -1) {
             // if there is no unite
             objIng = {
                 count: 1,
                 unit: '',
                 ingredient: ingredient
             }
        }
        return objIng;
      })
      this.ingredients = newIngredients;
  }
}

