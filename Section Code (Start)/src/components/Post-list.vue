<template>
    <div class="component">
        <h3>Information from package json</h3>
        <p>Vue great posts</p>
        <!-- NOTE  name has to match "name" props -->
        <!-- senting the data via props from parent to child -->
        <div v-if="showProduct">
            <div v-bind:key="idx" v-for="(product, idx) in products"> 
                <div class="row">
                    <div class="col-md-5 col-md-offset-0"> 
                        <figure>
                            <img class="product" v-bind:src="product.image">
                        </figure>
                        
                    </div>
                    <div class="col-md-6 col-md-offset-0 description" >
                       {{product.title}}
                    </div><!-- end of row-->
                    <hr /> 
                </div><!-- end of v-for--> 
            </div><!-- end of showProduct-->

        </div>
        </div>
</template>

<script>
    export default {
        props: ["post"],
        data(){
            return {
         showProduct: true,
         products: []
            }
        },
        methods: {
            switchName() {
                return this.newName.split("").reverse().join("");
            }
        },

        created: function () {
            axios.get('../products.json') //#A
                .then((response) => {
                    this.products = response.data.products; //#B
                    console.log(this.products);
                });
        }
    }
</script>

<style scoped>
    div {
        background-color: lightseagreen;
    }
</style>