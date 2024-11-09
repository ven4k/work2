<template>
  <form class="addForm">
    <div class="addForm__contentWrapper">
      <div class="addForm__content" v-for="([key, value], index) in Object.entries(data)" :key="index">
        <input v-model="formValues[key]"/>
        <label>{{ value }}</label>
      </div>
      <MainButton :disabled="!hasEveryFilledField" @click.stop.prevent="handleAddData">Добавить</MainButton>
      <span><small>*Необходимо заполнить все поля</small></span>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import MainButton from "../Buttons/MainButton/MainButton.vue";

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});
const emit = defineEmits([
  'addData'
])
const formValues = ref(Object.fromEntries(Object.entries(props.data).map(([key]) => [key, ''])))

const handleAddData = () => {
  emit('addData', formValues.value)
  formValues.value = {}
}
const hasEveryFilledField = computed(() => {
  return Object.values(formValues.value).every(value => {
    return value !== null && value !== undefined && value.trim() !== '';
  });
})

</script>

<style lang="scss" scoped>
.addForm {
  height: 100%;
}
.addForm__contentWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
  height: 88%;
}
.addForm__content {
  width: 100%;
  position: relative;

  input {
    width: 90%;
    height: 26px;
    border-radius: 4px;
  }
  label {
    position: absolute;
    top: -100%;
    left: 0;
    font-weight: 600;
  }
}
</style>
