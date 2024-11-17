<template>
  <div>
    <div class="tableWrapper">
      <h2>{{ tableTitle }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th v-for="(header, index) in theader" :key="index">
              {{ header }}
            </th>
            <th v-if="isPossibleDeleteItem"></th>
            <th v-if="isApplication && !isPossibleDeleteItem"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tbody" :key="rowIndex">
            <td v-for="(key, cellIndex) in Object.keys(row)" :key="cellIndex">
              <span v-if="!isApplication">
                {{ row[key] ? row[key] : "-" }}
              </span>
              <span v-if="isApplication && !isPossibleDeleteItem">
                {{ row[key] ? row[key] : "-" }}
              </span>
              <span
                v-if="isApplication && isPossibleDeleteItem && key !== 'status'"
              >
                {{ row[key] ? row[key] : "-" }}
              </span>
              <select
                v-if="isApplication && isPossibleDeleteItem && key === 'status'"
                @change="handleUpdateTableData($event, row.application_id)"
              >
                <option value="">Не выбрано</option>
                <option
                  v-for="item in applicationStatusData"
                  :selected="item === row.status"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
            </td>
            <td
              v-if="
                isApplication &&
                !isPossibleDeleteItem &&
                row.status === 'Одобрено'
              "
              style="width: 10%"
            >
              <button
                :disabled="catalogItemCount(row.catalog_id)?.leftCount < row.catalog_item_count"
                @click="
                  handleAcceptAplication(
                    row.application_id,
                    row.operation_type,
                    row.catalog_item_count,
                    row.catalog_id
                  )
                "
              >
                Выполнить
              </button>
              <div v-if="catalogItemCount(row.catalog_id)?.leftCount < row.catalog_item_count" style="color: red">Извините, на складе не хватает данного товара :(</div>
            </td>
            <td v-if="isPossibleDeleteItem" @click="$emit('deleteData', row)">
              X
            </td>
          </tr>
        </tbody>
      </table>
      <div class="emptyTable" v-if="!tbody.length">
        Здесь пока ничего нет :(
      </div>
    </div>
    <MainButton
      v-if="isPossibleAddItem"
      @click="$emit('addData')"
      class="tableAddBtn"
      >{{ addBtnText }}</MainButton
    >
  </div>
</template>

<script setup>
import { computed } from "vue";
import MainButton from "../Buttons/MainButton/MainButton.vue";
import { useStore } from "vuex"

const store = useStore()
const props = defineProps({
  tableTitle: { type: String, default: "" },
  theader: { type: Array, default: () => [] },
  tbody: { type: Array, default: () => [] },
  isPossibleAddItem: { type: Boolean, default: false },
  isPossibleDeleteItem: { type: Boolean, default: false },
  addBtnText: { type: String, default: "" },
  isApplication: { type: Boolean, default: false },
  applicationStatusData: { type: Array, default: () => [] },
});
const emit = defineEmits([
  "addData",
  "deleteData",
  "updateTableData",
  "acceptApplication",
]);
const catalogItemCount = computed(() => (catalogId) => store.state.catalog.find((item) => item.catalog_id === catalogId));
const handleUpdateTableData = (status, applicationId) => {
  emit("updateTableData", status.target.value, applicationId);
};
const handleAcceptAplication = (applicationId, action, itemCount, itemId) => {
  emit("acceptApplication", applicationId, action, itemCount, itemId);
};
</script>

<style lang="scss">
.tableWrapper {
  overflow-x: auto;
  table-layout: fixed !important;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  text-align: left;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.table thead tr {
  background-color: #ffa73a;
  color: #000;
  font-weight: bold;
}

.table th,
.table td {
  padding: 12px 15px;
}

.table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.table tbody tr:nth-of-type(even) {
  background-color: #fff3e0;
}

.table tbody tr:last-of-type {
  border-bottom: 2px solid #ff8c00;
}

.table tbody tr:hover {
  background-color: #ffe0b2;
  cursor: pointer;
}

.tableAddBtn {
  margin: 10px 0 0 0;
  background-color: #ff8c00;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tableAddBtn:hover {
  background-color: #ffa500;
}

.emptyTable {
  font-size: 24px;
  text-align: center;
  padding: 20px;
  color: #ff8c00;
}
</style>
