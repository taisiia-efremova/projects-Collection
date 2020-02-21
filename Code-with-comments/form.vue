<template>
  <div v-if="loaded" class="freight-info-details">
    <div class="v-container">
      <!-- <layout-info :layoutName="$options.name" :dataInfo="dataInfo"/> -->

      <Header :title="data.form_title" />
      <!--******************************** ANCHOR BtnToggle component -->

      <v-btn-toggle v-model="tab" class="tabs mt-5" mandatory>
        <v-btn
          small
          class="tabs__item main--text"
          height="48"
          
        >
        Юридические лица (индивидуальные предприниматели), входящие в одну группу лиц
        </v-btn>

        <v-btn small class="tabs__item main--text" height="48">
          Документы
        </v-btn>
      </v-btn-toggle>
<!--    ANCHOR END BtnToggle component -->

<!--    ANCHOR Form component -->
      <div v-show="tab === 0">
        <v-form 
          ref="form" 
          v-model="valid" 
          lazy-validation
        >
        <!-- REVIEW   What getDate() does??? -->
        <!-- SECTION CARD 1 -->
          <v-card class="pa-5" color="white">
            <v-text-field
              class="freight-info-details__item-field"
              label="Дата подачи заявки"
              :value="getDate()"
              readonly
            />
            <p class="main--text">Период подачи сведений о группе лиц</p>
            <div class="freight-info-details__data">
              <v-text-field
                class="freight-info-details__item-field"
                type="date"
                label="С"
                v-model="start"
                :min="minDate"
                :max="maxDate"
                :rules="rules"
                required
              />
              <v-text-field
                class="freight-info-details__item-field"
                type="date"
                label="По"
                v-model="end"
                :min="minDate"
                :max="maxEndDate"
                :rules="rules"
                required
              />
            </div>
          </v-card>
           <!-- SECTION CARD 2 -->
          <v-card class="pa-5 mt-5" color="white">
            <div class="freight-info-details__data">
              <v-autocomplete
                autocomplete="off"
                v-if="!compData.inn"
                class="freight-info-details__item-field"
                label="Наименование организации фрахтователя"
                item-text="text"
                item-value="id"
                :loading="loaders.compVals"
                :no-data-text="noDataText"
                :items="compVals"
                v-model="compData.id"
                required dense clearable
                :search-input.sync="searchComp"
                :rules="rules"
              />
              <v-text-field
                v-if="compData.inn && hasData"
                class="freight-info-details__item-field"
                :label="comp_entity_data.name.label"
                :value="comp_entity_data.name.value"
                readonly
              />

              <v-autocomplete
                autocomplete="off"
                v-if="!compData.id"
                class="freight-info-details__item-field"
                label="ИНН"
                item-text="text"
                item-value="id"
                :loading="loaders.compVals"
                :no-data-text="noDataText"
                type="number"
                :items="compVals"
                v-model="compData.inn"
                dense clearable
                :search-input.sync="searchCompINN"
                :rules="rules"
                required
              />
              <v-text-field
                v-if="compData.id && hasData"
                class="freight-info-details__item-field"
                :label="comp_entity_data.inn.label"
                :value="comp_entity_data.inn.value"
                readonly
              />
            </div>
        <!-- NOTE CompanyData component appear when data comes -->
            <CompanyData
              v-if="
                (Object.keys(comp_entity_data).length !== 0 && compData.id) ||
                  compData.inn
              "
              :entity_data="comp_entity_data"
              :hidden="hiddenKeys"
              noTitle
            />

            <v-text-field
              class="freight-info-details__item-field"
              label="Выгодоприобретатель, бенефициарный владелец рыбопромыслового судна"
              type="text"
              v-model="payload.beneficiary"
              @input="makeChange"
            />

            <div class="mt-4">
              <p class="main--text">
                Сведения, подтверждающие наличие, возникновение, переход,
                прекращение ограничение (обременение) прав на суда в случае
                заключения договора фрахтования судна фрахтователем судна:
              </p>

              <v-textarea
                label="Введите сведения"
                v-model="payload.inform_charter"
                rows="3"
                outlined
                prepend-inner-icon="comment"
                @input="makeChange"
              />
            </div>
          </v-card>

         <!-- SECTION CARD 3 -->
          <v-card class="pa-5 mt-5" color="white">
            <div class="freight-info-details__data">
              <v-autocomplete
                autocomplete="off"
                v-if="!ownerData.inn"
                class="freight-info-details__item-field"
                item-text="text"
                item-value="id"
                :items="ownerVals"
                v-model="ownerData.id"
                :loading="loaders.ownerVals"
                :no-data-text="noDataText"
                required dense clearable
                label="Собственник рыбопромыслового судна"
                :search-input.sync="searchOwner"
                :rules="rules"
              />
              <v-text-field
                v-if="ownerData.inn && hasData"
                class="freight-info-details__item-field"
                :label="owner_entity_data.name.label"
                :value="owner_entity_data.name.value"
                readonly
              />

              <v-autocomplete
                autocomplete="off"
                v-if="!ownerData.id"
                class="freight-info-details__item-field"
                label="ИНН собственника"
                item-text="text"
                item-value="id"
                :items="ownerVals"
                v-model="ownerData.inn"
                :loading="loaders.ownerVals"
                :no-data-text="noDataText"
                type="number"
                required dense clearable
                :search-input.sync="searchOwnerINN"
                :rules="rules"
              />
              <v-text-field
                v-if="ownerData.id && hasData"
                class="freight-info-details__item-field"
                :label="owner_entity_data.inn.label"
                :value="owner_entity_data.inn.value"
                readonly
              />

              <v-autocomplete
                v-if="ownerData.inn || ownerData.id"
                :readonly="selectedByNum"
                autocomplete="off"
                class="freight-info-details__item-field"
                :items="imoNumbers"
                v-model="imoNumber"
                no-data-text="Данные отсутствуют"
                dense
                :clearable="selectedByNum === false"
                label="Номер ИМО"
                @change="updateShipNumber"
                :rules="rules"
                required
              />

              <v-autocomplete
                v-if="ownerData.inn || ownerData.id"
                :readonly="selectedByNum === false"
                autocomplete="off"
                class="freight-info-details__item-field"
                :items="regNumbers"
                v-model="regNumber"
                no-data-text="Данные отсутствуют"
                dense
                :clearable="selectedByNum"
                label="Номер свидетельства о праве собственности на судно/судовой билет"
                @change="updateShipImo"
                :rules="rules"
                required
              />

              <v-text-field
                v-if="imoNumber || payload.id_ship"
                autocomplete="off"
                class="freight-info-details__item-field"
                :value="ship.port_reg_date"
                type="date"
                dense
                label="Дата свидетельства о праве собственности на судно/судового билета"
                readonly
              />

              <v-autocomplete
                autocomplete="off"
                class="freight-info-details__item-field"
                item-text="text"
                item-value="id"
                :items="data.reason_rent_values"
                v-model="payload.ids_reason_rent"
                label="Основание, по которому лицо входит в группу лиц"
                chips small-chips deletable-chips
                dense
                multiple
                required
                :rules="rules"
                @input="makeChange"
              />
            </div>
          </v-card>
  <!-- SECTION CARD 4 -->
          <v-card
            class="pa-5 mt-5"
            color="white"
            v-if="imoNumber || payload.id_ship"
          >
            <p class="title main--text">Сведения о судне:</p>

            <div class="flex-group-justify">
              <v-text-field
                class="freight-info-details__item-field--shorten"
                readonly
                filled
                hide-details
                label="Тип судна"
                :value="ship.ship_type_name"
              />

              <v-text-field
                class="freight-info-details__item-field--shorten"
                readonly
                filled
                hide-details
                label="Бортовой номер"
                :value="ship.side_number"
              />

              <v-text-field
                class="freight-info-details__item-field--shorten"
                readonly
                filled
                hide-details
                label="Морской порт регистрации"
                :value="ship.subscription_port_name"
              />
            </div>
          </v-card>
  <!-- SECTION CARD 5 -->
          <v-card class="pa-5 mt-5" color="white">
            <div class="freight-info-details__data">
              <v-autocomplete
                autocomplete="off"
                v-if="!freightData.inn"
                class="freight-info-details__item-field"
                label="Наименование организации фрахтовщика"
                item-text="text"
                item-value="id"
                :items="freightVals"
                v-model="freightData.id"
                :loading="loaders.freightVals"
                :no-data-text="noDataText"
                required dense clearable
                :search-input.sync="searchFreight"
                :rules="rules"
              />
              <v-text-field
                v-if="freightData.inn && hasData"
                class="freight-info-details__item-field"
                :label="freight_entity_data.name.label"
                :value="freight_entity_data.name.value"
                readonly
              />

              <v-autocomplete
                autocomplete="off"
                v-if="!freightData.id"
                class="freight-info-details__item-field"
                label="ИНН"
                item-text="text"
                item-value="id"
                :items="freightVals"
                v-model="freightData.inn"
                :loading="loaders.freightVals"
                :no-data-text="noDataText"
                type="number"
                dense clearable
                :search-input.sync="searchFreightINN"
                :rules="rules"
                required
              />
              <v-text-field
                v-if="freightData.id && hasData"
                class="freight-info-details__item-field"
                :label="freight_entity_data.inn.label"
                :value="freight_entity_data.inn.value"
                readonly
              />
            </div>
 <!-- NOTE CompanyData component appear when data comes -->
            <CompanyData
              v-if="
                (Object.keys(freight_entity_data).length !== 0 &&
                  freightData.id) ||
                  freightData.inn
              "
              :entity_data="freight_entity_data"
              :hidden="hiddenKeys"
              noTitle
            />

            <p class="main--text">Сведения о фрахтовщике :</p>

            <v-textarea
              label="Введите сведения"
              v-model="payload.inform_freighter"
              rows="3"
              outlined
              prepend-inner-icon="comment"
              @input="makeChange"
            />
          </v-card>
        </v-form>
<!--    ANCHOR END Form component -->
        <GroupsInfoTable v-if="hasTable" class="mt-5">
          <tr>
            <td v-for="(cell, idx) in cells" :key="idx">
              <ul v-if="Array(cell).isArray">
                <li v-for="(i, idx) in cell" :key="idx">{{ i }}</li>
              </ul>
              <span v-else v-html="cell" />
            </td>
          </tr>
        </GroupsInfoTable>
      </div>

      <div v-show="tab === 1">
        <v-card class="pa-5" color="white">
          <keep-alive>
            <GroupsInfoDocs 
              :contractTypes="data.type_contract_values" 
              :hasTable="hasTable"
              @addDocState="pushDocs($event)" 
            />
          </keep-alive>
        </v-card>
      </div>

      <div v-show="tab === 0" class="actions pb-3">
        <v-btn
          :disabled="!(valid && isChanged)"
          text
          color="main"
          class="ml-2"
          @click="createTable"
        >
          Сформировать таблицу
        </v-btn>
        <v-btn
          :disabled="!(valid && Object.keys(uploaded).length)"
          text
          color="main"
          class="ml-2"
          :loading="dataLoading"
          @click="saveForm('51')"
        >
          Сохранить и отправить
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {sendData, sendDataTest} from '../../../store/wrapper';
  import {eventBus} from "../../../main";
  import checkRulesMixin from '../../../mixins/checkRulesMixin';
  import Header from '../components/Header';
  import CompanyData from '../components/CompanyData';
  import GroupsInfoDocs from '../components/GroupInfoDocs';
  import GroupsInfoTable from '../components/GroupsInfoTable';

  export default {
  name: 'GroupsInfoDetails',

   mixins: [checkRulesMixin],

  data() {
    return {
      data: {},
      tab: 0,
      valid: false,

      searchComp: null,
      searchCompINN: null,
      searchOwner: null,
      searchOwnerINN: null,
      searchFreight: null,
      searchFreightINN: null,

      compData: {
        id: null,
        inn: null
      },
      ownerData: {
        id: null,
        inn: null
      },
      freightData: {
        id: null,
        inn: null
      },

      compVals: [],
      ownerVals: [],
      freightVals: [],

      comp_entity_data: {},
      owner_entity_data: {},
      freight_entity_data: {},

      imoNumber: null,
      regNumber: null,
      ship: {},
      selectedByNum: null,
      hasData: false,
      hasTable: false,
      noDataText: 'Начните вводить запрос',
      isChanged: false,

      loaders: {
        compVals: false,
        ownerVals: false,
        freightVals: false
      },

      start: this.getDate(),
      end: '',

      payload: {
        id_own_charterer: null, // *
        beneficiary: '',
        inform_charter: '',
        id_ship: null, // *
        id_own_freighter: null, // *
        inform_freighter: '',
        ids_reason_rent: [],
        id_status: null // *
      },

      cells: [],

      uploaded: {},

      rules: [
        v => !!v || 'Данное поле не должно быть пустым',
        v => (v && v.length !== 0) || 'Данное поле не должно быть пустым'
      ],

      hiddenKeys: ['inn', 'name']
    };
  },

  components: {
    Header,
    CompanyData,
    GroupsInfoDocs,
    GroupsInfoTable
  },

  computed: {
    ...mapGetters('ux', ['dataLoading', 'networkError']),
    ...mapGetters('messages', ['isFail']),

    loaded() {
      return Object.keys(this.data).length !== 0;
    },

    imoNumbers() {
      if (this.owner_entity_data.ships) {
        return this.owner_entity_data.ships.map(ship => ship.imo_number);
      }
    },

    regNumbers() {
      if (this.owner_entity_data.ships) {
        return this.owner_entity_data.ships.map(ship => ship.port_reg_number);
      }
    },

    maxDate() {
      const max = new Date();
      max.setDate(max.getDate() + 31);
      return max.toISOString().split('T')[0];
    },

    maxEndDate() {
      let max;

      if(this.getDate() !== this.start) {
        const timestamp = Date.parse(this.start);
        let selectedDate = new Date(timestamp);
        selectedDate.setDate(selectedDate.getDate() + 365);
        max = selectedDate.toISOString().split('T')[0];
      } else {
        max = new Date();
        max.setDate(max.getDate() + 365);
        max = max.toISOString().split('T')[0];
      }

      return max;
    },

    minDate() {
      return this.getDate();
    }
  },

  // beforeRouteLeave(to, from, next) {
  //   if (this.isChanged && !this.networkError) {
  //     const approve = confirm('Вы уверены, что хотите покинуть страницу без сохранения изменений?');
  //     approve ? next() : next(false);
  //   } else {
  //     next();
  //   }
  // },

  watch: {

    searchComp(val) {
      if (!val) {
        return
      }
      this.getCompany(val, 'ac_own_by_name', 'compVals');
    },
    searchCompINN(val) {
      if (!val) {
        return
      }
      this.getCompany(val, 'ac_own_by_inn', 'compVals');
    },

    searchOwner(val) {
      if (!val) {
        return
      }
      this.getCompany(val, 'ac_ship_owner_by_name', 'ownerVals');
    },
    searchOwnerINN(val) {
      if (!val) {
        return
      }
      this.getCompany(val, 'ac_ship_owner_by_inn', 'ownerVals');
    },

    searchFreight(val) {
      if (!val) {
        return
      }
      this.getCompany(val, 'ac_own_by_name', 'freightVals');
    },
    searchFreightINN(val) {
      if (!val) {
        return
      }
      this.getCompany(val, 'ac_own_by_inn', 'freightVals');
    },

    compData: {
      handler(val) {
        if (val) this.getEntityData('charterer_id', 'comp_entity_data');
      },
      deep: true
    },

    ownerData: {
      handler(val) {
        if (val) this.getEntityData('ship_owner_id', 'owner_entity_data');
      },
      deep: true
    },

    freightData: {
      handler(val) {
        if (val) this.getEntityData('freighter_id', 'freight_entity_data');
      },
      deep: true
    }
  },

  methods: {
    async initialize() {
      this.$store.commit('ux/setCompLoading', true);

      if (!this.routeEndpoint) {
        this.routeEndpoint = this.$route.fullPath.split('/')[2];
      }

      this.isChanged = false;
      // this.payload = {};
      eventBus.$emit('clearModels');

      try {
        const resp = await sendData('exchangeData/getPage', null, {route_path: this.routeEndpoint});
        this.data = JSON.parse(resp.data.value);
        this.$store.commit('ux/setFormTitle', this.data.form_title);
  
        console.log(`${this.$options.name} component DATA has been INITIALIZED!`);
      } catch (err) {
        throw new Error(err.message);
      }
    },

    makeChange() {
      this.isChanged = true;
    },

    getDate() {
      return new Date().toISOString().split('T')[0];
    },

    findShip() {
      let x = this.selectedByNum ? 'port_reg_number' : 'imo_number';
      let y = this.selectedByNum ? 'regNumber' : 'imoNumber';

      const ship = this.owner_entity_data.ships.filter(ship => ship[x] === this[y]);
      this.ship = Object.assign({}, this.ship, ship[0]);
    },

    updateShipNumber() {
      this.ship = {};
      if (this.imoNumber) {
        this.selectedByNum = false;
        this.findShip();
        this.regNumber = this.ship.port_reg_number;
        this.payload.id_ship = this.ship.ship_id;
        this.makeChange();
      } else {
        this.regNumber = null;
        this.selectedByNum = null;
        this.payload.id_ship = null;
      }
    },

    updateShipImo() {
      this.ship = {};
      if (this.regNumber) {
        this.selectedByNum = true;
        this.findShip();
        this.imoNumber = this.ship.imo_number;
        this.payload.id_ship = this.ship.ship_id;
        this.makeChange();
      } else {
        this.imoNumber = null;
        this.selectedByNum = null;
        this.payload.id_ship = null;
      }
    },

    async getCompany(val, funcName, dataStore) {
      // cancel pending call
      clearTimeout(this._timerId);

      this.loaders[dataStore] = true;

      this._timerId = setTimeout(() => {
        this.getData(val, funcName, dataStore)
      }, 300);
    },

    async getData(val, funcName, dataStore) {
      try {
        const resp = await sendDataTest({ q_str: val }, { function: funcName });
        this[dataStore] = JSON.parse(resp.data.value);
        this.loaders[dataStore] = false;
        if(this[dataStore].length === 0) {
          this.noDataText = 'Данные отсутствуют';
        }
      } catch(err) {
        this.loaders[dataStore] = false;
        this.noDataText = 'Данные отсутствуют';
        console.log(err);
      }
    },

    async getEntityData(idType, dataStore) {
      this.hasData = false;
      try {
        this.$store.commit('ux/setDataLoading', true);

        const resp = await sendDataTest(
          {
            payload: JSON.stringify({
              [idType]: this.getParams(idType)
            }),
            item_id: this.$route.params.id
          },
          { function: 'get_uor_groups_info_details' }
        );

        this[dataStore] = JSON.parse(resp.data.value);
        const prefix = dataStore.split('_')[0];

        if (Object.keys(this.compData).length !== 0)
          this.payload.id_own_charterer = this.compData.inn || this.compData.id;

        if (Object.keys(this.freightData).length !== 0)
          this.payload.id_own_freighter =
            this.freightData.inn || this.freightData.id;

        this.hasData = true;
        this.isChanged = true;
        this.noDataText = 'Начните вводить запрос';
      } catch (err) {
        console.log(err);
      }
    },

    getParams(idType) {
      switch (idType) {
        case 'charterer_id':
          return this.compData.id || this.compData.inn;
        case 'freighter_id':
          return this.freightData.id || this.freightData.inn;
        case 'ship_owner_id':
          return this.ownerData.id || this.ownerData.inn;
      }
    },

    createTable() {
      if (this.$refs.form.validate()) {
        let array = [];
        if(this.payload.ids_reason_rent) {
          this.payload.ids_reason_rent.map(id => {
            return this.data.reason_rent_values.forEach(reason => {
              if(reason.id === id) array.push(reason.text)
            });
          });
        } else array = '---';

        const cells = [
          `${this.comp_entity_data.name.value}`,
          `${this.freight_entity_data.name.value}`,
          `${this.comp_entity_data.address.value}`,
          `${this.freight_entity_data.address.value}`,
          `${this.comp_entity_data.reg_number.value}, от ${this.comp_entity_data.registration_date.value}`,
          `${this.freight_entity_data.reg_number.value}, от ${this.freight_entity_data.registration_date.value}`,
          `${this.comp_entity_data.inn.value}`,
          `${this.freight_entity_data.inn.value}`,
          `${this.payload.beneficiary}`,
          `${this.owner_entity_data.name.value}`,
          `${array}`,
          `${this.ship.port_reg_number}, ${this.ship.port_reg_date}`,
          `${this.uploaded.contract_sale ? this.uploaded.contract_sale.doc_num + ', от ' + this.uploaded.contract_sale.doc_date : null}`,
          `${this.uploaded.contract && this.uploaded.contract.type_contract === 2 ? this.uploaded.contract.doc_num + ', от ' + this.uploaded.contract.doc_date : null}`,
          `Судно: ${this.ship.ship_type_name}, ИМО: ${this.ship.imo_number},
          Бортовой номер: ${this.ship.side_number}, Морской порт:
          ${this.ship.subscription_port_name}`,
          `${this.uploaded.contract && this.uploaded.contract.type_contract === 3 ? this.uploaded.contract.doc_num + ', от ' + this.uploaded.contract.doc_date : null}`,
          `${this.payload.inform_freighter}`,
          `${this.payload.inform_charter}`
        ];

        let regex = /null/g;
        let listRegex = /»,/g;

        this.cells = cells.map(cell => {
          if(cell.includes('undefined')) {
            cell = '---'
          }
          else if(cell.includes('null')) {
            if(cell.match(/null+/g).length > 1) {
              cell = '---';
            } else {
              cell = cell.replace(regex, '---');
            }
          } else if(cell.includes('пп.')) {
            cell = cell.replace(listRegex, '»,<br/>');
          } else if(cell === '') {
            cell = '---'
          }
          return cell;
        });

        this.hasTable = true;
        this.isChanged = false;
      }
    },

    pushDocs(evt) {
      this.uploaded = evt;

      if(this.hasTable) {
        this.createTable();
      }
    },

    async saveForm(status) {
      if (this.$refs.form.validate()) {
        this.payload.id_status = status;
        this.payload.cert_app_begin = this.start;
        this.payload.cert_app_end = this.end;

        this.$store.commit('ux/setDataLoading', true);

        try {
          await sendData('exchangeData/savePage', null, {
            route_path: 'uor-groups-info-details',
            data_in: JSON.stringify({
              id: this.$route.params.id || null,
              payload: this.payload,
              contract: this.uploaded.contract,
              doc: this.uploaded.doc,
              contract_sale: this.uploaded.contract_sale
            })
          });

          if (!this.isFail) {
            this.$store.commit('ux/setDataLoading', false);
            this.$store.commit('ux/setSnackState', {
              message: 'Данные отправлены и сохранены',
              snackState: true
            });
            setTimeout(() => {
              this.$router.push('/applications/uor-groups-info');
            }, 2000);
          }
        } catch (err) {
          this.$store.commit('ux/setDataLoading', false);
          throw new Error(err);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.freight-info-details {
  &::v-deep th {
    white-space: inherit;
  }

  &::v-deep td {
    min-width: 0;
  }

  &::v-deep th:first-child {
    min-width: 20px;
  }

  td:first-child {
    min-width: 20px;
  }

  &__data {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &::after {
      content: '';
      display: block;
      min-width: 40%;
    }
  }

  &__item-field {
    min-width: 49%;
    max-width: 49%;

    &--shorten {
      min-width: 32%;
      max-width: 32%;
    }
  }

  &::v-deep .v-chip--disabled {
    color: #000000 !important;
    opacity: 1;
  }
}
</style>
