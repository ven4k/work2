<template>
  <div class="popup__wrapper" v-if="isOpenPopup" @keydown.esc="closeByEsc" tabindex="0" ref="popupElement">
    <h2 class="popup__title">{{ title }}</h2>
    <slot></slot>
    <div class="popup__close" @click="$emit('close')">X</div>
  </div>
</template>

<script setup>
import { watch, nextTick, ref } from 'vue';

const props = defineProps({
  isOpenPopup: { type: Boolean, default: false },
  title: { type: String, default: "" },
});

const emit = defineEmits([
  'close'
])

const popupElement = ref();

const closeByEsc = (e) => {
  e.stopPropagation();
  popupElement.value?.focus()
  emit('close')
}

watch(() => props.isOpenPopup, (newValue) => {
  nextTick(() => {
    if (newValue) {
      popupElement.value?.focus();
    }
  });
});

</script>

<style lang="scss">
.popup__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  width: 400px;
  height: 100%;
  padding: 30px;
  border-left: 1px solid #ffa726;
  overflow: hidden;
}
.popup__close {
  position: fixed;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  text-align: center;
  cursor: pointer;
}
.popup__title {
  font-size: 32px;
}

.input {
  width: 95%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ffcc80;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  appearance: none;
}

.input:focus {
  outline: none;
  border-color: #ffa726;
  box-shadow: 0 0 5px rgba(255, 167, 38, 0.5);
}

.input:hover {
  border-color: #ffa726;
}
</style>
