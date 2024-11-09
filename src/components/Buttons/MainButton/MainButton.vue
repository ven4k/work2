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
  border: 2.5px solid #e0e1e4;
  box-shadow: 0px 0px 20px -20px;
  cursor: pointer;
  background-color: #009879;
  transition: all 0.2s ease-in-out 0ms;
  font-family: "Poppins", sans-serif;
  color: white;
}

.mainButton:hover {
  background-color: darkgreen;
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
