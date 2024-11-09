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
    <MainButton class="createBtn" @click="handleCreateData" :disabled="isDisabledBtn()">Создать</MainButton>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MainButton from "../Buttons/MainButton/MainButton.vue";

const emit = defineEmits(["close", "addData"]);

const props = defineProps({
  catalog: { type: Array, default: () => [] },
  clients: { type: Array, default: () => [] },
  employees: { type: Array, default: () => [] },
  workType: { type: Array, default: () => [] },
  status: { type: Array, default: () => [] },
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

const selectData = [
  {
    label: "Мастера",
    dataName: "client",
    data: clientsData.value,
  },
  {
    label: "Менеджеры",
    dataName: "employee",
    data: employeesData.value,
  },
  {
    label: "Товары",
    dataName: "catalog",
    data: catalogData.value,
  },
  {
    label: "Типы операций",
    dataName: "workType",
    data: props.workType,
  },
  {
    label: "Статус",
    dataName: "status",
    data: props.status,
  },
];

const formValues = ref({
  client: "",
  employee: "",
  catalog: "",
  workType: "",
  status: "",
});

const isDisabledBtn = () => {
  return !(
    formValues.value.client.length &&
    formValues.value.employee.length &&
    formValues.value.catalog.length &&
    formValues.value.workType.length &&
    formValues.value.status.length
  );
};
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
