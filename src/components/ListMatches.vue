<template>
  <ul class="list-matches in-progress-list">
    <li class="match" v-for="match in matchesList" :key="match.fifa_id">
      <div class="home-team" :class="[getTeamMatchClass(match, match.home_team.country)]">
        <div class="flag"><img :src="countryFlagURL(match.home_team.country)" alt=""></div>
        <div class="team-name">{{ match.home_team.country }}</div>
        <div class="score" v-if="match.status !== 'future'">{{ match.home_team.goals }}</div>
      </div>
      <div class="away-team" :class="[getTeamMatchClass(match, match.away_team.country)]">
        <div class="flag"><img :src="countryFlagURL(match.away_team.country)" alt=""></div>
        <div class="team-name">{{ match.away_team.country }}</div>
        <div class="score" v-if="match.status !== 'future'">{{ match.away_team.goals }}</div>
      </div>
    </li>
  </ul>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ListMatches',
  props: ['matchesList'],
  methods: {
    countryFlagURL (countryName) {
      return '/img/flags/flag-of-' + countryName.split(' ').join('-') + '.png'
    },
    getTeamMatchClass (match, team) {
      if ((match.status === 'future' && moment(match.datetime).format('LL') > moment().format('LL')) || match.status === 'in progress') {
        return 'in-progress'
      }
      if (match.status === 'future' && moment(match.datetime).format('LL') === moment().format('LL')) {
        return 'waiting'
      }
      if (match.winner) {
        return (match.winner === team && match.winner !== 'Draw') ? 'winner' : (match.winner !== team && match.winner !== 'Draw') ? 'loser' : 'draw'
      } else {
        return ((match.home_team.goals > match.away_team.goals && team === match.home_team.country) || (match.away_team.goals > match.home_team.goals && team === match.away_team.country)) ? 'winner' : (match.home_team.goals === match.away_team.goals) ? 'draw' : 'loser'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

@import '../assets/stylesheets/_variables.scss';
@import '../assets/stylesheets/_functions.scss';

.list-matches {
  list-style-type: none;
  padding: 0;
  max-width: rem(500px);
  margin: auto;

  .match {
    display: flex;
    justify-content: center;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: rem(10px);
    }
    .home-team,
    .away-team {
      display: flex;
      align-items: center;
      flex: 1 0 50%;
      margin: rem(5px);

      &.winner {
        color: $porcelain;
        background-color: $jungleGreen;

        .score {
          background-color: $jewel;
        }
      }
      &.loser {
        color: $porcelain;
        background-color: $cinnabar;

        .score {
          background-color: $thunderbird;
        }
      }
      &.in-progress {
        color: $porcelain;
        background-color: $curiousBlue;

        .score {
          background-color: $mariner;
        }
      }
      &.draw,
      &.waiting {
        color: $porcelain;
        background-color: $cascade;

        .score {
          background-color: $osloGray;
        }
      }
      &.waiting {
        opacity: 0.5;
      }
      .team-name,
      .score {
        padding: rem(5px) rem(10px);
      }
      .flag {
        img {
          max-height: rem(27px);
          margin: 0 rem(5px);
          display: block;
        }
      }
      .team-name {
        flex: 1;
        line-height: rem(23px);
      }
      .score {
        font-size: rem(20px);
        line-height: rem(23px);
      }
    }
  }
}

</style>
