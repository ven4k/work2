<template>
  <div style="display: flex; gap: 30px">
    <NavMenu :contentData="contentData" @selectContent="handleChooseContent" :activeContent="choosedContentDataIndex"/>
    <component :is="contentData[choosedContentDataIndex].component" :isAdmin="isAdmin" />
    <div class="role">{{ role }}</div>
    <div class="exitBtn" @click="handleClickExit">Выход</div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted } from "vue";
import { useRouter } from "vue-router";
import Clients from "../Clients/Clients.vue";
import Employees from "../Employees/Employees.vue";
import Catalog from "../Catalog/Catalog.vue";
import ApplicationForm from "../ApplicationForm/ApplicationForm.vue";
import NavMenu from "../NavMenu/NavMenu.vue";

const router = useRouter();
const isAdmin = ref(true);

const role = ref('')
const contentData = shallowRef([
  {
    componentTitle: "Товары",
    component: Catalog,
  },
  {
    componentTitle: "Менеджеры",
    component: Employees,
  },
  {
    componentTitle: "Заявки",
    component: ApplicationForm,
  },
]);

const choosedContentDataIndex = ref(0);

const handleChooseContent = (index) => {
  choosedContentDataIndex.value = index
}

onMounted(() => {
  if (sessionStorage.getItem("isLogged")) {
    isAdmin.value = true;
    role.value = 'Admin'
    contentData.value.push({
      cardName: "Мастера",
      description: "Учет клиентов",
      component: Clients,
      img: "clients.svg",
    });
  } else {
    role.value = 'Master'
    isAdmin.value = false;
  }
});

const handleClickExit = () => {
  sessionStorage.removeItem("isLogged");
  sessionStorage.removeItem("isLoggedMaster");

  router.push("/");
};
</script>

<style lang="scss" scoped>
.mainMenu__card {
  background-color: #fff;
  border: 2px solid #009879;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 160px;
  padding: 60px 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  & > div:first-child {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  & > div:last-child {
    font-size: 10px;
    color: #555;
  }
}

.exitBtn {
  position: absolute;
  background-color: #ff6347;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  top: 8px;
  right: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e55039;
  }
}
.role {
  position: absolute; 
  top: 18px;
  right: 60px;
  width: 100px;
}
</style>
