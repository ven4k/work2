<template>
  <div>
    <div v-for="element in selectData">
      <h4>{{ element.label }}</h4>
      <select class="createFormSelect" v-model="formValues[element.dataName]">
        <option class="createFormOption" value="">Не выбрано</option>
        <option
          class="createFormOption"
          v-for="item in element.data"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
    </div>
    <MainButton class="createBtn" @click="handleCreateData" :disabled="isDisabledBtn">Создать</MainButton>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import MainButton from "../Buttons/MainButton/MainButton.vue";

const emit = defineEmits(["close", "addData"]);

const props = defineProps({
  catalog: { type: Array, default: () => [] },
  clients: { type: Array, default: () => [] },
  employees: { type: Array, default: () => [] },
  operationType: { type: Array, default: () => [] },
  status: { type: Array, default: () => [] },
  isAdmin: { type: Boolean, default: true }
});

const clientsData = ref(
  props.clients.map((item) => {
    return `${item.lastName} ${item.firstName} ${item.patronymic} ${item.phone}`;
  })
);
const employeesData = ref(
  props.employees.map((item) => {
    return `${item.lastName} ${item.firstName} ${item.patronymic} ${item.phone}`;
  })
);
const catalogData = ref(
  props.catalog.map((item) => {
    return `${item.name} ${item.catalog_id}`;
  })
);
const formValues = ref({
  master: "",
  manager: "",
  catalog: "",
  opertionType: "",
  status: props.isAdmin ? "" : props.status[0]
});

const selectData = ref([
  {
    label: "Мастера",
    dataName: "master",
    data: clientsData.value,
  },
  {
    label: "Менеджеры",
    dataName: "manager",
    data: employeesData.value,
  },
  {
    label: "Товары",
    dataName: "catalog",
    data: catalogData.value,
  },
  {
    label: "Типы операций",
    dataName: "opertionType",
    data: props.operationType,
  },

]);

onMounted(() => {
  if(props.isAdmin) {
    selectData.value.push({
    label: "Статус",
    dataName: "status",
    data: props.status,
  })
  }
})

const isDisabledBtn = computed(() => {
  return !Object.values(formValues.value).every(item => item.length)
});

const handleCreateData = () => {
  emit("addData", formValues.value);
  emit("close");
};
</script>

<style lang="scss" scoped>
.createFormSelect {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("../../assets/selectArrow.svg");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #009879;
    box-shadow: 0 0 5px rgba(0, 152, 121, 0.5);
  }

  &:hover {
    border-color: #009879;
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
}
.createBtn {
  margin-top: 24px;
}
</style>
