import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Contact from "@/views/Contact.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// before enter
router.beforeEach((to, from, next) => {
  // if query params date
  if (to.query.date) {
    const date = new Date(to.query.date.split("-").reverse().join("-"));
    if (date.getTime()) {
      store.commit("readings/SET_DATE_PARAM", date);
    }
  }
  else
    store.commit("readings/SET_DATE_PARAM", new Date());
  next();
});


export default router;
