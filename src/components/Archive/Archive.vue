<template>
  <TableWrapper
    :theader="Object.values(applicationTableHeader)"
    :tbody="archiveBodyData"
    tableTitle="Архив"
  />
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import TableWrapper from "../TableWrapper/TableWrapper.vue";
import applicationTableHeader from "../../mock-data/applicationsTableHeaders.json";
defineProps({
  isAdmin: { type: Boolean, default: true },
});

const store = useStore();

const archiveBodyData = computed(() => store.state.archiveData);
</script>

<style lang="scss" scoped>
.tarif__wrapper {
  display: flex;
}
.tarif__title {
  font-weight: 700;
}
.tarif__content {
  margin: 0 0 10px 0;
}
</style>
