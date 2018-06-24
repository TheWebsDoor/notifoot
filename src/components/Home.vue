<template>
  <div class="feed">
    <div v-if="!loadingDatas">
      <h2>{{ $t('titles.inProgressMatches') }}</h2>
      <ul class="list-matches in-progress-list" v-if="inProgressMatches && inProgressMatches.length > 0">
        <li class="match" v-for="match in inProgressMatches" :key="match.fifa_id">
          <div class="home-team in-progress">
            <div class="flag"><img :src="countryFlagURL(match.home_team.country)" alt=""></div>
            <div class="team-name">{{ match.home_team.country }}</div>
            <div class="score">{{ match.home_team.goals }}</div>
          </div>
          <div class="away-team in-progress">
            <div class="flag"><img :src="countryFlagURL(match.away_team.country)" alt=""></div>
            <div class="team-name">{{ match.away_team.country }}</div>
            <div class="score">{{ match.away_team.goals }}</div>
          </div>
        </li>
      </ul>
      <div v-else>{{ $t('noMatches.inProgress') }}</div>
      <h2>{{ $t('titles.todaysMatches') }}</h2>
      <ul class="list-matches todays-list" v-if="todayMatches && todayMatches.length > 0">
        <li class="match" v-for="match in todayMatches" :key="match.fifa_id">
          <div class="home-team" :class="[getWinnerClass(match, match.home_team.country)]">
            <div class="flag"><img :src="countryFlagURL(match.home_team.country)" alt=""></div>
            <div class="team-name">{{ match.home_team.country }}</div>
            <div class="score">{{ match.home_team.goals }}</div>
          </div>
          <div class="away-team" :class="[getWinnerClass(match, match.away_team.country)]">
            <div class="flag"><img :src="countryFlagURL(match.away_team.country)" alt=""></div>
            <div class="team-name">{{ match.away_team.country }}</div>
            <div class="score">{{ match.away_team.goals }}</div>
          </div>
        </li>
      </ul>
      <div v-else>{{ $t('noMatches.today') }}</div>
      <h2>{{ $t('titles.passedMatches') }}</h2>
      <ul class="list-matches todays-list" v-if="allMatches && allMatches.length > 0">
        <li class="match" v-for="match in allMatches" :key="match.fifa_id">
          <div class="home-team" :class="[getWinnerClass(match, match.home_team.country)]">
            <div class="flag"><img :src="countryFlagURL(match.home_team.country)" alt=""></div>
            <div class="team-name">{{ match.home_team.country }}</div>
            <div class="score">{{ match.home_team.goals }}</div>
          </div>
          <div class="away-team" :class="[getWinnerClass(match, match.away_team.country)]">
            <div class="flag"><img :src="countryFlagURL(match.away_team.country)" alt=""></div>
            <div class="team-name">{{ match.away_team.country }}</div>
            <div class="score">{{ match.away_team.goals }}</div>
          </div>
        </li>
      </ul>
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

export default {
  name: 'Home',
  data () {
    return {
      allMatches: null,
      todayMatches: null,
      inProgressMatches: null,
      loadingDatas: true
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
        body: 'Goal for ' + teamWhoScored + '! (' + match.home_team.country + ' (' + match.home_team.goals + ') - ' + match.away_team.country + ' (' + match.away_team.goals + '))'
      }
      new Notification('Goal!', options)
    },
    async fetchDatas () {
      await axios.get('https://worldcup.sfg.io/matches/')
        .then((response) => {
          this.todayMatches = response.data.filter((m) => {
            return moment(m.datetime).format('LL') === moment().format('LL')
          })
          this.allMatches = response.data.filter((m) => {
            return moment(m.future).format('LL') <= moment().format('LL') && m.status !== 'future'
          })
          this.allMatches.sort(function(a, b){
            return moment(b.datetime) - moment(a.datetime)
          })
          let oldStateInProgressMatches = (this.inProgressMatches) ? JSON.parse(JSON.stringify(this.inProgressMatches)) : null
          this.inProgressMatches = response.data.filter((m) => {
            return moment(m.future).format('LL') === moment().format('LL') && m.status === 'in progress'
          })
          if (oldStateInProgressMatches) {
            this.inProgressMatches.map((m) => {
              let oldMatchFound = oldStateInProgressMatches.find((m) => {
                return m.fifa_id === m.fifa_id
              })
              let teamWhoScored = (m.home_team.goals > oldMatchFound.home_team.goals) ? m.home_team.country : (m.away_team.goals > oldMatchFound.away_team.goals) ? m.away_team.country : null
              if (teamWhoScored) {
                this.goalNotification(teamWhoScored, m)
              }
            })
          }
        })
    }
  },
  async created () {
    Notification.requestPermission()

    await this.fetchDatas()
    this.loadingDatas = false
    setInterval(async () => {
      await this.fetchDatas()
    }, 10000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1 {
  display: flex;
  justify-content: center;
  align-items: center;

  i.icon {
    transform: translateY(-200px);
    animation-name: bounceInDown;
    animation-duration: 0.4s;
    animation-fill-mode: both;
    margin-right: 10px;
  }
}
h3 {
  margin: 40px 0 0;
}
.loading {
  margin-top: 50px;

  i.icon {
    font-size: 100px;
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
    font-size: 18px;
    margin-top: 20px;
  }
}
.list-matches {
  list-style-type: none;
  padding: 0;
  max-width: 500px;
  margin: auto;

  .match {
    display: flex;
    justify-content: center;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
    .home-team,
    .away-team {
      display: flex;
      align-items: center;
      flex: 1 0 50%;
      margin: 5px;

      &.winner {
        color: #fff;
        background-color: #27ae60;

        .score {
          background-color: #1b7943;
        }
      }
      &.loser {
        color: #fff;
        background-color: #e74c3c;

        .score {
          background-color: #b52516;
        }
      }
      &.in-progress {
        color: #fff;
        background-color: #3498db;

        .score {
          background-color: #2980b9;
        }
      }
      &.draw,
      &.waiting {
        color: #fff;
        background-color: #95a5a6;

        .score {
          background-color: #7f8c8d;
        }
      }
      &.waiting {
        opacity: 0.5;
      }
      .team-name,
      .score {
        padding: 5px 10px;
      }
      .flag {
        img {
          max-height: 27px;
          margin: 0 5px;
          display: block;
        }
      }
      .team-name {
        flex: 1;
      }
      .score {
        font-size: 20px;
      }
    }
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0px 0px 0px 0 rgba(44, 62, 80, 0.4);
  }
  70% {
    box-shadow: 0px 0px 0px 15px rgba(44, 62, 80, 0);
  }
  100% {
    box-shadow: 0px 0px 0px 0 rgba(44, 62, 80, 0);
  }
}

@keyframes bounceInDown {
  0% {
    transform: translateY(-200px);
  }
  50% {
    transform: translateY(0);
  }
  60% {
    transform: translateY(-20px);
  }
  90% {
    transform: translateY(0);
  }
  95% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
