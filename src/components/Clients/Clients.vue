<template>
  <TableWrapper
    :theader="Object.values(clientsTableHeaders)"
    :tbody="clientsBodyData"
    tableTitle="Мастера"
    addBtnText="Добавить мастера"
    :isPossibleAddItem="isAdmin"
    :isPossibleDeleteItem="isAdmin"
    @addData="handleTogglePopup"
    @deleteData="handleDeleteData"
  />
  <PopupWrapper :isOpenPopup="isOpenAddFormPopup" @close="handleTogglePopup" title="Мастер">
    <AddForm :data="clientsTableHeaders" @addData="handleAddData" />
  </PopupWrapper>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import TableWrapper from "../TableWrapper/TableWrapper.vue";
import clientsTableHeaders from "../../mock-data/clientsTableHeaders.json";
import { useNotification } from "@kyvg/vue3-notification";
import AddForm from "../AddForm/AddForm.vue";
import PopupWrapper from "../PopupWrapper/PopupWrapper.vue";
import { useStore } from "vuex";

defineProps({
  isAdmin: { type: Boolean, default: true }
})
const store = useStore()
const { notify } = useNotification();

const clientsBodyData = ref([]);
const isOpenAddFormPopup = ref(false);

const handleTogglePopup = () => {
  isOpenAddFormPopup.value = !isOpenAddFormPopup.value;
};
const handleAddData = (data) => {
  clientsBodyData.value = [...clientsBodyData.value, data]
};
const handleDeleteData = (data) => {
  clientsBodyData.value = clientsBodyData.value.filter(
    (el) => el.phone !== data.phone
  );
  notify({
    text: "Клиент удалён",
  });
};

onMounted(() => {
  clientsBodyData.value = store.state.clients
})
onUnmounted(() => {
  store.commit('updateClients', clientsBodyData.value);
  sessionStorage.setItem('clients', JSON.stringify(clientsBodyData.value))
})
</script>

<style lang="scss" scoped>
.clients__content {
  margin: 0 0 20px 0;
}
</style>
