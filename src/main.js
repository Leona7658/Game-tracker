import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import request from "@/request/index";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./styles/index.scss";
import "./utils/permission.js";
import VueFeather from "vue-feather";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import "./styles/layouts.scss";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import lazyPlugin from "vue3-lazy";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};


// close all Debug log reference from https://blog.csdn.net/halo1416/article/details/122595285
const isDebug = process.env.NODE_ENV !== "production";
console.log = (function (oldLogFunc) {
  return function () {
    if (isDebug) {
      oldLogFunc.apply(this, arguments);
    }
  }
})(console.log);

window.addEventListener("resize", appHeight);
appHeight();

loadFonts();
app.component(VueFeather.name, VueFeather);
app.component("Datepicker", Datepicker);
app.use(ElementPlus);
app.use(vuetify);
app.use(PerfectScrollbar);
app.use(lazyPlugin, {
  loading: require("@/assets/default/loading.gif"),
  error: require("@/assets/default/error.png"),
});

app.config.globalProperties.$request = request;

app.use(router).use(store).mount("#app");
