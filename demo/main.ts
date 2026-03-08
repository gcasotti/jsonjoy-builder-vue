import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { auraPreset } from "../src/themes/presets.ts";
import App from "./App.vue";
import "./index.css";

declare const __BASE_PATH__: string;

const router = createRouter({
  history: createWebHistory(__BASE_PATH__),
  routes: [
    {
      path: "/",
      component: () => import("./pages/Index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("./pages/NotFound.vue"),
    },
  ],
});

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: auraPreset,
    options: {
      darkModeSelector: ".jscb-dark",
    },
  },
  pt: {
    select: {
      overlay: { class: "jscb" },
    },
    dialog: {
      mask: { class: "jscb" },
    },
  },
});
app.directive("tooltip", Tooltip);
app.use(router);
app.mount("#app");
