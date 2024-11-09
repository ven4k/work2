import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";
import "normalize.css";
import Notifications from "./Notification/Notification.vue";
import { createStore } from "vuex";
import clientJSON from './mock-data/clients.json'
import employeesJSON from './mock-data/employees.json'
import catalogJSON from './mock-data/catalog.json'

const store = createStore({
  state: {
    clients: JSON.parse(sessionStorage.getItem('clients')) || clientJSON,
    employees: JSON.parse(sessionStorage.getItem('employees')) || employeesJSON,
    catalog: JSON.parse(sessionStorage.getItem('catalog')) || catalogJSON,
  },
  mutations: {
    updateClients(state, payload) {
      state.clients = payload;
    },
    updateEmployees(state, payload) {
      state.employees = payload
    },
    updateCatalog(state, payload) {
      state.catalog = payload
    }
  },
});
const app = createApp(App);
app.use(router);
app.use(store);
app.component(Notifications);
app.mount("#app");
