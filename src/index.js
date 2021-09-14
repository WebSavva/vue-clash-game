function getRandomValue(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}

const app = Vue.createApp({
  data() {
    return {
      health: {
        player: 100,
        monster: 100,
      },
      currentRound: 0,
      winner: null,
      actionLogs: [],
    };
  },
  computed: {
    monsterWidth() {
      return {
        width: this.health.monster + "%",
      };
    },
    playerWidth() {
      return {
        width: this.health.player + "%",
      };
    },
    isSpecialAttackProhibited() {
      return this.currentRound % 3 !== 0;
    },
    isHealingDisabled() {
      return this.health.player === 100;
    },
  },
  methods: {
    playerAttacks(isSpecial) {
      this.nextRound();
      const range = isSpecial ? [1, 15] : [1, 8];
      const attackValue = getRandomValue(...range);
      console.log(attackValue, "Player");
      let updatedMonsterHealth = this.health.monster - attackValue;
      this.actionLogs.unshift({
        owner: "player",
        value: attackValue,
        type: "attack",
      });
      if (updatedMonsterHealth <= 0) {
        this.health.monster = 0;
        this.winner = "player";
      } else {
        this.health.monster = updatedMonsterHealth;
        this.monsterAttacks();
      }
    },
    monsterAttacks() {
      const attackValue = getRandomValue(1, 10);
      console.log(attackValue, "Monster");
      let updatedPlayerHealth = this.health.player - attackValue;
      this.actionLogs.unshift({
        owner: "monster",
        value: attackValue,
        type: "attack",
      });
      if (updatedPlayerHealth <= 0) {
        this.health.player = 0;
        this.winner = "monster";
      } else {
        this.health.player = updatedPlayerHealth;
      }
    },
    playerHeals() {
      this.nextRound();
      const healValue = getRandomValue(1, 6);

      this.actionLogs.unshift({
        owner: "player",
        value: healValue,
        type: "heal",
      });

      this.health.player += healValue;
      this.monsterAttacks();
    },
    nextRound() {
      this.currentRound++;
    },
    startGame() {
      this.currentRound = 0;
      this.health = {
        monster: 100,
        player: 100,
      };
      this.winner = null;
      this.actionLogs = [];
    },
    surrender() {
      this.health.player = 0;
      this.winner = "monster";
    },
  },
});

app.mount("#app");
