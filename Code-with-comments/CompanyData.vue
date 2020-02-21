<template>
  <div class="entity-data">

    <h1 v-if="!noTitle" class="title main--text mb-2">{{title}}</h1>

    <div class="entity-data__wrapper">
      <v-text-field
        class="entity-data__field mb-5"
        v-for="({value, label}, key) in entity_data"
        v-if="value && !hidden.includes(key)"
        :key="key"
        :label="label"
        :value="value ? value : 'Не указано'"
        readonly
        filled
        hide-details
      />
    </div>
  </div>


</template>

<script>
  export default {
    name: 'CompanyData',

    props: {
      entity_data: Object,
      noTitle: Boolean,
      title: {
        type: String,
        default: 'Данные организации:'
      },
      hidden: {
        type: Array,
        default: function () { return [] }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .entity-data {

    &__wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    &__field {
      min-width: 49%;
      max-width: 49%;
    }

    &::after {
      content: '';
      display: block;
      min-width: 40%;
    }
  }
</style>
