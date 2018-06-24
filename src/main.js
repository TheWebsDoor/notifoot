import Vue from 'vue'
import VueCookie from 'vue-cookie'
import VueI18n from 'vue-i18n'
import translations from './i18n/translations'
import App from './App.vue'
import './assets/stylesheets/main.scss'

Vue.config.productionTip = false

Vue.use(VueCookie)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: translations
})

new Vue({
  render: h => h(App),
  i18n
}).$mount('#app')
