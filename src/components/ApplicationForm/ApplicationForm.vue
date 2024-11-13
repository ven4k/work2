<template>
  <TableWrapper
    tableTitle="Заявки"
    :theader="Object.values(applicationTableHeader)"
    :tbody="isAdmin ? applicationsBodyDataManager : applicationsBodyDataMaster"
    isApplication
    :applicationStatusData="statuses"
    addBtnText="Создать заявку"
    isPossibleAddItem
    :isPossibleDeleteItem="isAdmin"
    @addData="handleTogglePopup"
    @deleteData="handleDeleteData"
    @updateTableData="handleUpdateTableData"
    @acceptApplication="handleAcceptAplication"
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
const applicationsBodyDataManager = ref([]);
const applicationsBodyDataMaster = ref([]);

const operationType = ref(["Выдача", "Сдача", "Операция3", "Операция4"]);
const statuses = ref(["В процессе согласования", "Одобрено", "Отклонено"]);

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
    applicationsBodyDataManager.value = [...applicationsBodyDataManager.value, addData];
    store.commit('updateManagerApplicationData', [...applicationsBodyDataManager.value, addData])

  notify({
    duration: 3000,
    type: "success",
    title: "Заявка создана",
  });
};
const handleDeleteData = (data) => {
  applicationsBodyDataManager.value = applicationsBodyDataManager.value.filter(
    (el) => el.application_id !== data.application_id
  );
  notify({
    text: "Заявка удалена",
    type: "warn",
    duration: 3000,
  });
};

const handleUpdateTableData = (status, applicationId) => {
  applicationsBodyDataManager.value = applicationsBodyDataManager.value.map((el) => {
    if (el.application_id === applicationId) {
      if(status === 'Одобрено' || status === 'Отклонено') {
        store.commit('updateMasterApplicationData', { ...el, status })
      }
      return [ ...el, status ];
    }
    return el;
  });
  store.commit('updateManagerApplicationData', applicationsBodyDataManager.value);
};

const handleAcceptAplication = (applicationId, action, itemCount, itemId) => {
  catalogJSON.value = catalogJSON.value.map(el => {
    if (el.catalog_id === itemId) {
      let data
      if(action === 'Выдача') {
        data = {
          ...el,
          leftCount: el.leftCount - itemCount
        }
      }
      if(action === 'Сдача') {
        data = {
          ...el,
          leftCount: el.leftCount + itemCount
        }
      }
      return data
    }
    return el;
  });
  applicationsBodyDataManager.value = applicationsBodyDataManager.value.filter(el => el.application_id !== applicationId)
  store.commit('updateManagerApplicationData', applicationsBodyDataManager.value)
  store.commit('updateCatalogData', catalogJSON.value);
}

onMounted(() => {
  const sessionStorageApplicationsManager = sessionStorage.getItem("managerApplications");
  const sessionStorageApplicationsMaster = sessionStorage.getItem("masterApplications");

  if (props.isAdmin) {
    if (sessionStorageApplicationsManager) {
      applicationsBodyDataManager.value = JSON.parse(sessionStorageApplicationsManager);
    } else {
      applicationsBodyDataManager.value = store.state.managerApplicationData;
    }
  } else {
    if (sessionStorageApplicationsMaster) {
      applicationsBodyDataMaster.value = JSON.parse(sessionStorageApplicationsMaster);
    } else {
      applicationsBodyDataMaster.value = store.state.masterApplicationData;
    }
  }
});
onUnmounted(() => {
  if(props.isAdmin) {
    sessionStorage.setItem(
    "managerApplications",
    JSON.stringify(applicationsBodyDataManager.value)
  );
  } else {
    sessionStorage.setItem(
    "managerApplications",
    JSON.stringify(applicationsBodyDataManager.value)
  );
    sessionStorage.setItem(
    "masterApplications",
    JSON.stringify(applicationsBodyDataMaster.value)
  );
  }
});

console.log('applicationsBodyDataManager', applicationsBodyDataManager)
</script>

<style lang="scss"></style>
