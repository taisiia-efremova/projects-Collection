<template>
    <div class="component">
        <h3>You may view the User Details here</h3>
        <p>Many Details</p>
        <slot></slot>
        <!-- NOTE  name has to match "name" props -->
        <!-- senting the data via props from parent to child -->
        <p>User Name: {{switchName() }}</p>
          <slot name="title"></slot>
        <h4>{{idNum}}</h4>
          <slot name="text"></slot>
        <h3>Display an Area value {{area}}</h3>
        <button @click="addLength">Add length</button>
    </div>
</template>

<script>
export default {
    props: ["newName", "idNum"],
    data() {
        return {
        length: 23,
        width: 21,
       
        }
    },
    methods: {
        switchName() {
            return this.newName.split("").reverse().join("");
        },
        addLength() {
            this.length ++;
        },
      
    },
    computed: {
        area: function() {
            return this.width * this.length;
        }
    },
    watch: {
     length: function(newVal,oldVal) {
         console.log("this is old val of length" + oldVal + " this is a new value " + newVal)
     }
    }
}
</script>

<style scoped>
    div {
        background-color: lightcoral;
    }
</style>
