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
import { ref, onMounted, computed } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import TableWrapper from "../TableWrapper/TableWrapper.vue";
import applicationTableHeader from "../../mock-data/applicationsTableHeaders.json";
import PopupWrapper from "../PopupWrapper/PopupWrapper.vue";
import CreateApplication from "../CreateApplication/CreateApplication.vue";

import { useStore } from "vuex";

const store = useStore();

const clientsJSON = computed(() => store.state.clients);
const employeesJSON = computed(() => store.state.employees);
const catalogJSON = computed(() => store.state.catalog);
const updatedArchivedItems = ref([])

const props = defineProps({
  isAdmin: { type: Boolean, default: true },
});

const { notify } = useNotification();
const isOpenAddFormPopup = ref(false);
const applicationsBodyDataManager = ref([]);
const applicationsBodyDataMaster = ref([]);

const operationType = ref(["Выдача", "Сдача"]);
const statuses = ref(["В процессе согласования", "Одобрено", "Отклонено"]);

const handleTogglePopup = () => {
  isOpenAddFormPopup.value = !isOpenAddFormPopup.value;
};

const getCurrentDate = computed(() => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
});

const handleAddData = (data) => {
  const { master, manager, catalog, count, status, opertionType } = data;

  const addCatalogId = catalog?.split(" ").slice(-1).join(" ");
  const addCatalogName = catalog?.split(" ").slice(0, 3).join(" ");

  const addMasterFullName = master?.split(" ").slice(0, 3).join(" ");
  const addMasterPhone = master?.split(" ").slice(-1).join();

  const addManagerFullName = manager?.split(" ").slice(0, 3).join(" ");

  const masterData = clientsJSON.value.find((el) => el.phone == addMasterPhone);

  const addData = {
    application_id: Date.now().toString().slice(-6),
    catalog_id: addCatalogId,
    catalog_item_name: addCatalogName,
    catalog_item_count: count,
    master_id: masterData.id,
    fullname_master: addMasterFullName,
    fullname_manager: addManagerFullName,
    date_create: getCurrentDate.value,
    operation_type: opertionType,
    status: status,
  };
  applicationsBodyDataManager.value = [
    ...applicationsBodyDataManager.value,
    addData,
  ];
  applicationsBodyDataMaster.value = [
    ...applicationsBodyDataMaster.value,
    addData,
  ];
  updateAplicationData()
  notify({
    duration: 3000,
    type: "success",
    title: "Заявка создана",
  });
};
const handleDeleteData = (data) => {
  const updatedData = {...data, status: 'Удалён'}
  updatedArchivedItems.value = [...updatedArchivedItems.value, updatedData]
  applicationsBodyDataMaster.value = applicationsBodyDataMaster.value.filter(
    (el) => el.application_id !== data.application_id
  );
  applicationsBodyDataManager.value = applicationsBodyDataManager.value.filter(
    (el) => el.application_id !== data.application_id
  );
  updateArchiveData(data.application_id)
  updateAplicationData()
  notify({
    text: "Заявка удалена",
    type: "warn",
    duration: 3000,
  });
};

const handleUpdateTableData = (status, applicationId) => {
  applicationsBodyDataManager.value = applicationsBodyDataManager.value.map(
    (el) => {
      if (el.application_id === applicationId) {
        let updatedData
        if (status === "Одобрено") {
          updatedData = {...el, status}
          applicationsBodyDataMaster.value = applicationsBodyDataMaster.value.map(item => {
            if(item.application_id === applicationId) {
              return updatedData
            }
            return item
          })
        }
        if(status === 'Отклонено') {
          updatedData = {...el, status}
          updatedArchivedItems.value = [...updatedArchivedItems.value, updatedData];
          applicationsBodyDataManager.value = applicationsBodyDataManager.value.filter(
            (el) => el.application_id !== applicationId
          );
        }
        return updatedData;
      }
      return el;
    }
  );
  updateArchiveData(applicationId)
  updateAplicationData()

  notify({
    text: "Статус обновлён!",
    type: "success",
    duration: 3000,
  });
};

const handleAcceptAplication = (applicationId, action, itemCount, itemId) => {
  const newCatalog = catalogJSON.value.map((el) => {
    if (el.catalog_id === itemId) {
      let data;
      if (action === "Выдача") {
        data = {
          ...el,
          leftCount: el.leftCount - itemCount,
        };
      }
      if (action === "Сдача") {
        data = {
          ...el,
          leftCount: Number(el.leftCount) + Number(itemCount),
        };
      }
      return data
    }
    return el
  });
  store.commit("updateCatalog", newCatalog);
  sessionStorage.setItem(
    "catalog",
    JSON.stringify(newCatalog)
  );
  const archivedItem = applicationsBodyDataMaster.value.find(el => el.application_id === applicationId)
  applicationsBodyDataMaster.value = applicationsBodyDataMaster.value.filter(
    (el) => el.application_id !== applicationId
  );
  applicationsBodyDataManager.value = applicationsBodyDataManager.value.filter(
    (el) => el.application_id !== applicationId
  );
  updatedArchivedItems.value = [...updatedArchivedItems.value, archivedItem]
  updateArchiveData(applicationId)
  updateAplicationData()
  notify({
    text: "Заявка успешно выполнена!",
    type: "success",
    duration: 3000,
  });
};

const updateAplicationData = () => {
  store.commit(
    "updateMasterApplicationData",
    applicationsBodyDataMaster.value
  );
  store.commit(
    "updateManagerApplicationData",
    applicationsBodyDataManager.value
  );
  sessionStorage.setItem(
    "managerApplications",
    JSON.stringify(applicationsBodyDataManager.value)
  );
  sessionStorage.setItem(
    "masterApplications",
    JSON.stringify(applicationsBodyDataMaster.value)
  );
}
const updateArchiveData = () => {
  store.commit(
    "updateArchive",
    updatedArchivedItems.value
  );
  sessionStorage.setItem(
    "archiveData",
    JSON.stringify(updatedArchivedItems.value)
  );
}

onMounted(() => {
  updatedArchivedItems.value = store.state.archiveData
  applicationsBodyDataManager.value = store.state.managerApplicationData;
  applicationsBodyDataMaster.value = store.state.masterApplicationData;
});
</script>

<style lang="scss"></style>
