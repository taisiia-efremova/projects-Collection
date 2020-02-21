<template>
    <div class="component">
        <h1>The User Component</h1>
        <p>I'm an awesome User!</p>
        <button @click="changeName">Change my Name</button>
        <hr>
        <div class="row">
            <div >
                <!-- 'name' data name from parent -->
                <!-- "newName" is a name fo prop in child  -->
                <app-user-detail :newName="name" :idNum="id">
                    <h3 slot="title">The slot title</h3>
                <p slot="text">The slot text</p>

                </app-user-detail>
            </div>
            <div>
                <app-user-edit></app-user-edit>
                <PostList>

                </PostList>
               <Form></Form>
                <!-- NOTE iterate through an array/data -->
                <!-- <ul>
                    <li v-for="post in posts"
                      v-bind:key="post.id" 
               >{{post.title}} </li>
                </ul> -->

                <!-- NOTE  Iterate through the object/data -->
                <!-- <ul>
                    <li v-for="(value,key) in object" :key="key">
               {{value}} is a {{key}}</li>
                </ul> -->
                <button v-bind:disabled="isButtonDisable"> I am disabled Button</button>
                <button v-on:click="myFunction"> Working Button</button>
                <!-- NOTE Alternative to a  Mustache notation  -->
                <p v-text="guid"></p>
            
                    <div class="row product">
                        <div class="col">
                             <img v-bind:src="product.image">
                           
                        </div>
                        <div class="col col-expand">
                            <h1 v-text="product.title"></h1>

                            <h3 v-html="product.description"></h3> 
                            <h4 class="price">{{product.price | formatPrice}}</h4>
                          
                           
                            <button 
                              @click="addToCart"
                               v-if="canAddToCart">
                             Add product to your Card
                             </button>
                         <button type="button" 
                         class="btn-blue"
                         @click="showCheckout"
                         v-if="cart.length > 0"
                         ><span>{{cartItemCount}}</span></button>
                        </div>
                    </div>
               <p>all pets are together goin to walk. {{allPetsTogether}}</p>
              
            </div>
            
        </div> 
     
<!-- <div class="rating">
  <span v-for="n in 5">☆</span>		
</div> -->

    </div>
  
</template>

<script>
    import UserDetail from './UserDetail.vue';
    import UserEdit from './UserEdit.vue';
    import Form from './Form.vue';
    import PostList from './Post-list.vue';
    export default {
        data() {
            return {
                posts: [{
                        id: 1,
                        title: 'My journey with Vue'
                    },
                    {
                        id: 2,
                        title: 'Blogging with Vue'
                    },
                    {
                        id: 3,
                        title: 'Why Vue is so fun'
                    }
                ],
                isButtonDisable: true,
                name: "Great Name",
                id: "5e3bb643ddd4a2b512e7cfff",
                price:2354,
                index: 0,
                guid: "95b4d4e7-b09e-4098-9afd-93603d48d345",
                isActive: true,
                balance: "$1,622.57",
                picture: "http://placehold.it/32x32",
                product: {
                    id: 1001,
                    title: "Cat Food, 25lb bag",
                    description: "А 25 pound bag of <em>irresistiЬle</em>," + "organic goodness for your cat.",
                    price: 2000,
                    image: "../assets/vacation.jpg",
                    rating:3,
                },
                description: "А 25 pound bag of <em>irresistiЬle</em>," + "organic goodness for your cat.",
                age: 20,
                object: {
                    cat: "Tom",
                    dog: "Jack",
                    fish: "Freddy",
                    rabbit: "John"
                },
                cart: [],
                availableAmount: 5,
                showProduct: true
               
            };
        },

        methods: {
            changeName() {
                this.name = "anna"
            },
            myFunction() {
                console.log("i am working")
            },
            addToCart: function() {
                this.cart.push(this.product.id);
               
            },
            showCheckout() {
                this.showProduct = this.showProduct ? false : true;
            }},
    filters: {
        formatPrice: function(price) {
       return price + 1;
        
            }
        
    },
    computed: {
        allPetsTogether: function() {
            return [this.object.cat,this.object.dog, "and ", this.object.fish].join(" ");
        },  
         cartItemCount: function() {
                return this.cart.length || " ";
            },
              canAddToCart: function () {
            return this.availableAmount > this.cart.length
           
        },
    },
        components: {
            appUserDetail: UserDetail,
            appUserEdit: UserEdit,
            PostList: PostList,
            Form:Form
        },
       

    }
</script>

<style scoped>
.btn-blue {
    background-color: aqua;
}
    div {
        background-color: lightblue;
    };
    .price {
color:blue;
    }
    /* .rating-active:before {
   content: "\2605";
   position: absolute;
}
.rating {
  display: inline;
  margin-left: 10px;
  margin-top: 10px;
  float:right;
}
.rating > span {
  display: inline-block;
  position: relative;
  width: 1.1em;
} */
</style>