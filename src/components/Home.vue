<template>
  <div class="feed">
    <div class="alert alert-danger" v-if="networkError">{{ $t('errorNetwork') }}</div>
    <div v-if="!loadingDatas">
      <div v-if="(!matches.inProgress || matches.inProgress.length === 0) && (matches.future && matches.future.length > 0) && dayFinished">
        <h2>{{ $t('titles.nextMatches') }}</h2>
        <ListMatches :matchesList="matches.future" v-if="matches.future && matches.future.length > 0"/>
        <div v-else>{{ $t('noMatches.future') }}</div>
      </div>
      <div v-else>
        <h2>{{ $t('titles.inProgressMatches') }}</h2>
        <ListMatches :matchesList="matches.inProgress" v-if="matches.inProgress && matches.inProgress.length > 0"/>
        <div v-else>{{ $t('noMatches.inProgress') }}</div>
      </div>
      <h2>{{ $t('titles.todaysMatches') }}</h2>
      <ListMatches :matchesList="matches.today" v-if="matches.today && matches.today.length > 0"/>
      <div v-else>{{ $t('noMatches.today') }}</div>
      <h2>{{ $t('titles.passedMatches') }}</h2>
      <ListMatches :matchesList="matches.all" v-if="matches.all && matches.all.length > 0"/>
      <div v-else>{{ $t('noMatches.finished') }}</div>
    </div>
    <div class="loading" v-else>
      <i class="icon icon-logo"></i>
      <div class="label">{{ $t('loading') }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import ListMatches from './ListMatches'

export default {
  name: 'Home',
  components: {
    ListMatches
  },
  data () {
    return {
      matches: {
        all: null,
        today: null,
        inProgress: null,
        future: null
      },
      networkError: null,
      loadingDatas: true
    }
  },
  computed: {
    dayFinished () {
      let dayNotFinished = false
      if (this.matches.today) {
        this.matches.today.map((m) => {
          if (m.status === 'future' || m.status === 'in progress') {
            dayNotFinished = true
          }
        })
      }
      return !dayNotFinished
    }
  },
  methods: {
    countryFlagURL (countryName) {
      return '/img/flags/flag-of-' + countryName.split(' ').join('-') + '.png'
    },
    getWinnerClass (match, team) {
      if (match.status === 'future') {
        return 'waiting'
      }
      if (match.status === 'in progress') {
        return 'in-progress'
      }
      if (match.winner) {
        return (match.winner === team && match.winner !== 'Draw') ? 'winner' : (match.winner !== team && match.winner !== 'Draw') ? 'loser' : 'draw'
      } else {
        return ((match.home_team.goals > match.away_team.goals && team === match.home_team.country) || (match.away_team.goals > match.home_team.goals && team === match.away_team.country)) ? 'winner' : (match.home_team.goals === match.away_team.goals) ? 'draw' : 'loser'
      }
    },
    goalNotification (teamWhoScored, match) {
      var options = {
        body: this.$t('notification.goalFor', { team: teamWhoScored }) + ' (' + match.home_team.country + ' (' + match.home_team.goals + ') - ' + match.away_team.country + ' (' + match.away_team.goals + '))'
      }
      new Notification(this.$t('notification.goal'), options)
    },
    async fetchDatas () {
      await axios.get('https://notifoot-api.alaqasar.com/')
        .then((response) => {
          this.networkError = false
          this.matches.today = response.data.filter((m) => {
            return moment(m.datetime).format('LL') === moment().format('LL')
          })
          this.matches.all = response.data.filter((m) => {
            return moment(m.datetime).format('LL') <= moment().format('LL') && m.status !== 'future' && m.status !== 'in progress'
          })
          this.matches.future = response.data.filter((m) => {
            return moment(m.datetime).format('LL') === moment().add('1', 'days').format('LL') && m.status === 'future'
          })
          let addDays = 2
          while ((!this.matches.future || this.matches.future.length === 0) && addDays < 30) {
            this.matches.future = response.data.filter((m) => {
              return moment(m.future).format('LL') === moment().add(addDays, 'days').format('LL') && m.status === 'future'
            })
            addDays++
          }
          this.matches.all.sort(function(a, b){
            return moment(b.datetime) - moment(a.datetime)
          })
          let oldStateInProgressMatches = (this.matches.inProgress) ? JSON.parse(JSON.stringify(this.matches.inProgress)) : null
          this.matches.inProgress = response.data.filter((m) => {
            return moment(m.future).format('LL') === moment().format('LL') && m.status === 'in progress'
          })
          // console.log(oldStateInProgressMatches, this.matches.inProgress)
          if (oldStateInProgressMatches && 'Notification' in window) {
            this.matches.inProgress.map((m) => {
              let oldMatchFound = oldStateInProgressMatches.find((om) => {
                return m.fifa_id === om.fifa_id
              })
              if (oldMatchFound) {
                let teamWhoScored = (m.home_team.goals > oldMatchFound.home_team.goals) ? m.home_team.country : (m.away_team.goals > oldMatchFound.away_team.goals) ? m.away_team.country : null
                if (teamWhoScored) {
                  this.goalNotification(teamWhoScored, m)
                }
              }
            })
          }
        })
        .catch(error => {
          if (error) {
            this.networkError = true
          }
        })
    }
  },
  async created () {
    await this.fetchDatas()
    this.loadingDatas = false
    setInterval(async () => {
      await this.fetchDatas()
    }, 20000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

@import '../assets/stylesheets/_variables.scss';
@import '../assets/stylesheets/_functions.scss';

h3 {
  margin: rem(40px) 0 0;
}

.alert-danger {
  margin-top: rem(20px);
}

.loading {
  margin-top: rem(50px);

  i.icon {
    font-size: rem(100px);
    position: relative;
    display: inline-block;
    border-radius: 50%;
    animation-name: pulse;
    animation-duration: 1.5s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;

    &::before {
      display: inline-block;
      animation: rotating 2s linear infinite;
    }
  }
  .label {
    font-size: rem(18px);
    margin-top: rem(20px);
  }
}

</style>
