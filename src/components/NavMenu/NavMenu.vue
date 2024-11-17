<template>
  <div class="navMenu">
    <div v-for="(item, index) in contentData">
      <h3 @click="$emit('selectContent', index)" :class="[{'navMenu__activeItem': activeContent === index}, 'navMenu__item']">
        {{ item.componentTitle }}
      </h3>
    </div>
  </div>
</template>

<script setup>
defineEmits(["selectContent"]);
const props = defineProps({
  contentData: { type: Array, default: () => [] },
  activeContent: { type: Number, default: 0 },
});
</script>

<style lang="scss" scoped>
.navMenu {
  position: fixed;
  top: 0;
  left: 0;
  border-right: 1px solid #ffa726;
  background-color: #f7f7f7;
  max-width: 180px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  &__item {
    padding: 2px 20px;
    cursor: pointer;
  }
  &__activeItem {
    border-radius: 8px;
    background-color: #ffa726 ;
  }
}
</style>
