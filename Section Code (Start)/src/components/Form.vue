<template>
<div class="box">
  <h3>Great form</h3>
  <form>
  First name:<br>
  <input v-model.lazy="order.firstName" type="text" name="firstname"><br>
  Last name:<br>
  <input v-model="order.lastName" type="text" name="lastname">
  <p>Select your country</p>
  <select v-model="order.state">
  <option value="Russia">Russia</option>
  <option value="USA">USA</option>
  <option value="Portugal">Portugal</option>
  <option value="Italy">Italy</option>
</select>
<br>
<input  type="checkbox" id="catalog" name="scales"
         checked
         v-bind:true-value="order.sendCatalog"
         v-bind:false-value="order.dontsendCatalog"
         v-model="order.catalog">
  <label for="catalog">Include catalog</label>
  <input type="checkbox" id="sale-info" name="scales"
         checked>
  <label for="sale-info">sent me an email about sale</label>
  <br>
  <input type="radio" name="delivery" value="Delivery"> I need delivery<br>
<input type="radio" name="delivery" value="noDelivery"> I will do it myself, thank you<br>
  <input type="submit" @click="submitForm" value="Submit">
</form>
<div class="box-display">
    
       <p> First Name: {{order.firstName}}
        <br>Last Name: {{order.lastName}}
         <br>Your country is: {{order.state}}
        </p>
        <br>
        <p>Catalog{{order.catalog}}</p>
    
</div>
  </div>
</template>

<script>
export default {
data(){
    return{
        order:{
            firstName:"",
            lastName:"",
            state:"",
            sendCatalog:"",
           dontsendCatalog:"",
           catalog:"",
           sendCatalog:"Sent me a catalog",
           dontsendCatalog:"i dont need a catalog",
        }
    }
},
methods: {
    submitForm() {
        alert("submitted")
    }
}
}
</script>

<style scoped>
.box {
    padding:20px;
 background-color: lavender;
 border: 2px dotted black;
}
.box-display{
    background-color:springgreen;
    height: 100px;
}
</style>
