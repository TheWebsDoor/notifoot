<template>
  <div id="app" :class="{'night-mode': nightMode}">
    <h1><i class="icon icon-logo"></i> Notifoot</h1>
    <button class="btn" @click="toggleNightMode"><i class="icon icon-night-mode"></i> {{ changeStateNightModeLabel }}</button>
    <Home />
    <div class="copyrights"><a href="https://thewebsdoor.com">The Web's Door</a></div>
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'app',
  components: {
    Home
  },
  data () {
    return {
      nightMode: false
    }
  },
  computed: {
    changeStateNightModeLabel () {
      return (this.nightMode) ? this.$t('nightMode.disable') : this.$t('nightMode.enable')
    }
  },
  methods: {
    toggleNightMode () {
      this.nightMode = !this.nightMode
      if (this.nightMode) {
        document.getElementsByTagName('body')[0].classList.add('night-mode')
      } else {
        document.getElementsByTagName('body')[0].classList.remove('night-mode')
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 60px 20px;
}

.copyrights {
  margin-top: 30px;
}
</style>
