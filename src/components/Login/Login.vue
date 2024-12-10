<template>
  <div>
    <form>
      <h2 style="text-align: center;">Авторизация</h2>
      <div class="form__wrapper">
        <div class="form__inputsWrapper">
          <input class="form__input" type="text" placeholder="Логин" v-model="login" />
          <input class="form__input" type="password" placeholder="Пароль" v-model="password" />
        </div>
        <button
          type="submit"
          class="form__loginBtn"
          @click.stop.prevent="handleClickSubmitForm"
        >
          Войти
        </button>
        <div v-if="isWrongData" class="form__wrongData">Неправильный логин или пароль!</div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()

const login = ref("");
const password = ref("");
const isWrongData = ref(false);

onMounted(() => {
  sessionStorage.clear()
  sessionStorage.setItem("login", "admin");
  sessionStorage.setItem("login2", "manager");
  sessionStorage.setItem("password", "admin");
  sessionStorage.setItem("password2", "manager123");
  if(sessionStorage.getItem('isLogged') || sessionStorage.getItem('isLoggedMaster')) {
    router.replace('/main-menu')
  }
});

const handleClickSubmitForm = () => {
  const lsLogin = sessionStorage.getItem("login");
  const lsPassword = sessionStorage.getItem("password");
  const lsLogin2 = sessionStorage.getItem("login2");
  const lsPassword2 = sessionStorage.getItem("password2");
  if (login.value !== lsLogin || password.value !== lsPassword) {
    isWrongData.value = true;
    setTimeout(() => {
      isWrongData.value = false
    }, 3000)
  } else {
    sessionStorage.setItem('isLogged', `${login.value}${password.value}`)
    sessionStorage.setItem('isLoggedMaster', '')
    router.push({name: 'MainMenu'})
  }
  if((login.value !== lsLogin2 || password.value !== lsPassword2)) {
    isWrongData.value = true;
    setTimeout(() => {
      isWrongData.value = false
    }, 3000)
  } else {
    sessionStorage.setItem('isLogged', '')
    sessionStorage.setItem('isLoggedMaster', `${login.value}${password.value}`)
    router.push({name: 'MainMenu'})
  }
};
</script>

<style lang="scss" scoped>
.form__wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 2px solid #ff8c00;
  justify-content: space-between;
  gap: 20px;
  padding: 40px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form__inputsWrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.form__loginBtn {
  background-color: #ff8c00;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
  height: 40px;
  font-size: 1rem;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.form__loginBtn:hover {
  background-color: #ffa500;
  box-shadow: 0 0 0 5px rgba(255, 140, 0, 0.3);
}

.form__input {
  border: solid 1.5px #ff8c00;
  border-radius: 6px;
  background: none;
  padding: 16px;
  font-size: 16px;
  color: black;
  transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.form__input:focus {
  border: solid 1.5px #ff8c00;
}
.form__wrongData {
  border: 1px solid red;
  color: red;
  padding: 4px;
  border-radius: 6px;
}
</style>
