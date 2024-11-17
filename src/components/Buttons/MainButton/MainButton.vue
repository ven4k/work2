<template>
  <button class="mainButton">
    <slot></slot>
  </button>
</template>

<script setup></script>

<style lang="scss" scoped>
.mainButton {
  width: fit-content;
  min-width: 100px;
  height: 45px;
  padding: 8px;
  border-radius: 5px;
  border: 2.5px solid #ffcc80;
  box-shadow: 0px 0px 20px -20px;
  cursor: pointer;
  background-color: #ffa726;
  transition: all 0.2s ease-in-out 0ms;
  font-family: "Poppins", sans-serif;
  color: #000;
  font-weight: 600;
}

.mainButton:hover {
  background-color: #fb8c00;
  box-shadow: 0px 0px 20px -18px;
}

.mainButton:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: auto;
  border-color: #cccccc;
}

.mainButton:not(:disabled):active {
  transform: scale(0.95);
}
</style>
