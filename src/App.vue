<template>
  <div id="app" :class="{'night-mode': nightMode}">
    <h1>
      <span class="title"><i class="icon icon-logo"></i> Notifoot</span>
      <span class="baseline">Fifa World Cup 2018</span>
    </h1>
    <div class="infos">{{ $t('infos.noRefreshNeeded') }}<span v-if="!notificationsNotSupported"><br>{{ $t('infos.subscribeNotifications') }}</span></div>
    <div class="actions">
      <button class="btn" @click="toggleNightMode"><i class="icon icon-night-mode"></i> {{ changeStateNightModeLabel }}</button>
      <div class="custom-select language-selector">
        <div class="selected-value" @click="langSelectorListDisplayed = true"><i class="icon icon-lang"></i>{{ currentLanguage }}</div>
        <transition name="fade">
          <ul v-if="langSelectorListDisplayed">
            <li v-for="(lang, index) in listLanguages" :key="index" @click="selectLang(lang)" :class="[lang === currentLanguage ? 'current' : '']"><i class="icon icon-lang"></i> {{ lang }}</li>
          </ul>
        </transition>
      </div>
    </div>
    <Home/>
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
      nightMode: false,
      langSelectorListDisplayed: false,
      notificationsNotSupported: false
    }
  },
  computed: {
    changeStateNightModeLabel () {
      return (this.nightMode) ? this.$t('nightMode.disable') : this.$t('nightMode.enable')
    },
    currentLanguage () {
      return this.$i18n.locale
    },
    listLanguages () {
      let listLanguages = Object.keys(this.$i18n.messages).filter((l) => {
        return l !== this.$i18n.locale
      })
      listLanguages.unshift(this.$i18n.locale)
      return listLanguages
    }
  },
  methods: {
    toggleNightMode () {
      this.nightMode = !this.nightMode
      this.$cookie.set('nightMode', JSON.stringify(this.nightMode), { expires: '1Y' })
      this.manageNightModeClass()
    },
    manageNightModeClass () {
      if (this.nightMode) {
        document.getElementsByTagName('body')[0].classList.add('night-mode')
      } else {
        document.getElementsByTagName('body')[0].classList.remove('night-mode')
      }
    },
    selectLang (lang) {
      this.$i18n.locale = lang
      this.$cookie.set('currentLanguage', lang, { expires: '1Y' })
      this.langSelectorListDisplayed = false
    }
  },
  created () {
    if ('Notification' in window) {
      Notification.requestPermission()
    } else {
      this.notificationsNotSupported = true
    }
    if (!this.$cookie.get('currentLanguage')) {
      this.$cookie.set('currentLanguage', this.$i18n.locale, { expires: '1Y' })
    } else {
      this.$i18n.locale = this.$cookie.get('currentLanguage')
    }
    if (!this.$cookie.get('nightMode')) {
      this.$cookie.set('nightMode', 'false', { expires: '1Y' })
    } else {
      this.nightMode = JSON.parse(this.$cookie.get('nightMode'))
      this.manageNightModeClass()
    }
  }
}
</script>

<style lang="scss">

@import './assets/stylesheets/_variables.scss';
@import './assets/stylesheets/_functions.scss';

h1 {
  font-size: 2em;
  line-height: 1;
  display: inline-block;
  text-transform: uppercase;
  margin-bottom: 0;

  .title {
    display: flex;
    justify-content: center;
    align-items: center;

    i.icon {
      transform: translateY(rem(-200px));
      animation-name: bounceInDown;
      animation-duration: 0.6s;
      animation-fill-mode: both;
      margin-right: 10px;
    }
  }
  .baseline {
    display: block;
    text-align: right;
    flex: 1 0 100%;
    font-size: rem(12px);
    text-transform: uppercase;
    margin-bottom: rem(30px);
    opacity: 0.4;
    font-weight: normal;
  }
}

.copyrights {
  margin-top: rem(30px);
}

.infos {
  max-width: rem(600px);
  margin: auto;
  margin-bottom: rem(20px);
  font-size: rem(12px);
  font-style: italic;
}

.actions {
  display: flex;
  justify-content: center;

  button {
    margin-right: rem(10px);
  }
  .custom-select {
    display: block;
    position: relative;

    &.language-selector {
      text-transform: uppercase;
    }
    .selected-value {
      display: flex;
      align-items: center;
      padding: rem(8px) rem(15px);
      cursor: pointer;
      font-weight: bold;
      user-select: none;

      i.icon {
        margin-right: rem(5px);
      }
    }
    ul {
      padding: 0;
      display: inline-block;
    }
    .selected-value,
    ul {
      list-style: none;
      margin: 0;
      background-color: $pickledBluewood;
      color: $porcelain;
      border-radius: rem(5px);
      font-size: rem(14px);

      li {
        display: flex;
        align-items: center;
        padding: rem(8px) rem(15px);
        cursor: pointer;
        transition: .3s all;
        user-select: none;

        &:hover {
          background-color: $mariner;
        }
        &:first-child {
          border-top-left-radius: rem(5px);
          border-top-right-radius: rem(5px);
        }
        &:last-child {
          border-bottom-left-radius: rem(5px);
          border-bottom-right-radius: rem(5px);
        }
        &.current {
          font-weight: bold;
        }
        i.icon {
          margin-right: rem(5px);
        }
      }
    }
    ul {
      position: absolute;
      left: 0;
      top: 0;
      min-width: 100%;
    }
  }
}

</style>
