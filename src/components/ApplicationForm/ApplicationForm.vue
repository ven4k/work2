<template>
  <TableWrapper
    tableTitle="Заявки"
    :theader="Object.values(applicationTableHeader)"
    :tbody="applicationsBodyData"
    isApplication
    :applicationStatusData="statuses"
    addBtnText="Создать заявку"
    isPossibleAddItem
    :isPossibleDeleteItem="isAdmin"
    @addData="handleTogglePopup"
    @deleteData="handleDeleteData"
    @updateTableData="handleUpdateTableData"
  />
  <PopupWrapper
    :isOpenPopup="isOpenAddFormPopup"
    @close="handleTogglePopup"
    title="Заявки"
  >
    <CreateApplication
      @close="handleTogglePopup"
      @addData="handleAddData"
      :clients="clientsJSON"
      :employees="employeesJSON"
      :catalog="catalogJSON"
      :operationType="operationType"
      :status="statuses"
      :isAdmin="isAdmin"
    />
  </PopupWrapper>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import TableWrapper from "../TableWrapper/TableWrapper.vue";
import applications from "../../mock-data/applications.json";
import applicationTableHeader from "../../mock-data/applicationsTableHeaders.json";
import PopupWrapper from "../PopupWrapper/PopupWrapper.vue";
import CreateApplication from "../CreateApplication/CreateApplication.vue";

import { useStore } from "vuex";

const store = useStore();

const clientsJSON = computed(() => store.state.clients);
const employeesJSON = computed(() => store.state.employees);
const catalogJSON = computed(() => store.state.catalog);

const props = defineProps({
  isAdmin: { type: Boolean, default: true },
});

const { notify } = useNotification();
const isOpenAddFormPopup = ref(false);
const applicationsBodyData = ref(applications);

const operationType = ref(["Выдача", "Сдача", "Операция3", "Операция4"]);
const statuses = ref(["На рассмотрении", "Статус2", "Статус3", "Статус4"]);

const handleTogglePopup = () => {
  isOpenAddFormPopup.value = !isOpenAddFormPopup.value;
};

const getCurrentDate = computed(() => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
})

const handleAddData = (data) => {
  const { master, manager, catalog, status, opertionType } = data;

  const addCatalogId = catalog?.split(" ").slice(-1).join(" ");
  const addCatalogName = catalog?.split(" ").slice(0, 3).join(" ");

  const addMasterFullName = master?.split(" ").slice(0, 3).join(" ");
  const addMasterPhone = master?.split(" ").slice(-1).join();

  const addManagerFullName = manager?.split(" ").slice(0, 3).join(" ");
  const catalogData = catalogJSON.value.find(
    (el) => el.catalog_id == addCatalogId
  );
  const masterData = clientsJSON.value.find((el) => el.phone == addMasterPhone);
  
  const addData = {
    application_id: Date.now().toString().slice(-6),
    catalog_id: addCatalogId,
    catalog_item_name: addCatalogName,
    catalog_item_count: catalogData.count,
    master_id: masterData.id,
    fullname_master: addMasterFullName,
    fullname_manager: addManagerFullName,
    date_create: getCurrentDate.value,
    operation_type: opertionType,
    status: status,
  };
  if(props.isAdmin) {
    applicationsBodyData.value = [...applicationsBodyData.value, addData];
  } else {
    store.commit('updateManagerApplicationData', addData)
  }
  notify({
    duration: 3000,
    type: "success",
    title: "Заявка создана",
  });
};
const handleDeleteData = (data) => {
  applicationsBodyData.value = applicationsBodyData.value.filter(
    (el) => el.phone !== data.phone
  );
  notify({
    text: "Заявка удалена",
    type: "warn",
    duration: 3000,
  });
};

const handleUpdateTableData = (status, applicationId) => {
  applicationsBodyData.value = applicationsBodyData.value.map((el) => {
    if (el.application_id === applicationId) {
      return { ...el, status };
    }
    return el;
  });
};

onMounted(() => {
  const sessionStorageApplications = sessionStorage.getItem("applications");
  const parsedsessionStorageApplications = JSON.parse(
    sessionStorageApplications
  );
  if (sessionStorageApplications) {
    applicationsBodyData.value = parsedsessionStorageApplications;
  }
});
onUnmounted(() => {
  sessionStorage.setItem(
    "applications",
    JSON.stringify(applicationsBodyData.value)
  );
});
</script>

<style lang="scss"></style>
