import axios from 'axios';;

export default class Search {
    constructor(query) {
     this.query = query;
     
    }
  
    async getResults(query){
    try {
        const key = '95fd63b45fc36709412603f51bb0bece';
        const baseUrlData = 'https://api.themoviedb.org/3';
       
        // const query2 = "cat"
    let res = await fetch(`${baseUrlData}/search/movie?api_key=${key}&query=${this.query}`);
    let data = await res.json();
    this.results = data.results;

    console.log(this.results);
    
    // this.recipes = res.data.recipes;
    // console.log(this.recipes);
    } catch(error) {
        console.log("super error")
    } }
    

    // catch(error) {
    //     console.log('we have an error')
    // }
  

}







