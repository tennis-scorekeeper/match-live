import Game from "./Game.js";

export default class Set {
  constructor(
    ads,
    isEightGame,
    isMatchTiebreakSet,
    set,
    done,
    p1Score,
    p2Score
  ) {
    if (set == null && !done) {
      this.playerOneScore = 0;
      this.playerTwoScore = 0;

      this.currentGame = new Game(isMatchTiebreakSet, 10, ads, null);
      this.completedGames = [];

      this.adRule = ads;
      this.eightGameProSet = isEightGame;
      this.matchTiebreakSet = isMatchTiebreakSet;
    } else if (done) {
      this.playerOneScore = p1Score;
      this.playerTwoScore = p2Score;

      this.currentGame = new Game(isMatchTiebreakSet, 10, ads, null);
      this.completedGames = [];

      this.adRule = ads;
      this.eightGameProSet = isEightGame;
      this.matchTiebreakSet = isMatchTiebreakSet;
    } else {
      this.playerOneScore = set.playerOneScore;
      this.playerTwoScore = set.playerTwoScore;

      this.currentGame = new Game(false, 0, false, set.currentGame);
      this.completedGames = [];
      set.completedGames.forEach(completedGame => {
        this.completedGames.push(new Game(false, 0, false, completedGame));
      });

      this.adRule = set.adRule;
      this.eightGameProSet = set.eightGameProSet;
      this.matchTiebreakSet = set.matchTiebreakSet;
    }
  }
  incrementPlayerOneGameScore() {
    return this.currentGame.incrementPlayerOneScore();
  }

  incrementPlayerTwoGameScore() {
    return this.currentGame.incrementPlayerTwoScore();
  }

  incrementPlayerOneScore() {
    if (this.matchTiebreakSet) {
      this.playerOneScore = this.currentGame.getPlayerOneScore();
      this.playerTwoScore = this.currentGame.getPlayerTwoScore();
      return true;
    } else {
      this.playerOneScore++;
      this.completedGames.push(this.currentGame);

      var gamesNeeded = 6;
      if (this.eightGameProSet) {
        gamesNeeded = 8;
      }

      if (
        this.playerOneScore == gamesNeeded &&
        this.playerTwoScore == gamesNeeded
      ) {
        this.currentGame = new Game(true, 7, this.adRule, null);
      } else {
        this.currentGame = new Game(false, 0, this.adRule, null);
      }

      if (
        this.playerOneScore == gamesNeeded &&
        this.playerTwoScore <= gamesNeeded - 2
      ) {
        return true;
      }
      if (this.playerOneScore == gamesNeeded + 1) {
        return true;
      }
      return false;
    }
  }
  incrementPlayerTwoScore() {
    if (this.matchTiebreakSet) {
      this.playerOneScore = this.currentGame.getPlayerOneScore();
      this.playerTwoScore = this.currentGame.getPlayerTwoScore();
      return true;
    } else {
      this.playerTwoScore++;

      this.completedGames.push(this.currentGame);

      var gamesNeeded = 6;
      if (this.eightGameProSet) {
        gamesNeeded = 8;
      }

      if (
        this.playerOneScore == gamesNeeded &&
        this.playerTwoScore == gamesNeeded
      ) {
        this.currentGame = new Game(true, 7, this.adRule, null);
      } else {
        this.currentGame = new Game(false, 0, this.adRule, null);
      }

      if (
        this.playerTwoScore == gamesNeeded &&
        this.playerOneScore <= gamesNeeded - 2
      ) {
        return true;
      }
      if (this.playerTwoScore == gamesNeeded + 1) {
        return true;
      }
      return false;
    }
  }
  getTotalGames() {
    return this.playerOneScore + this.playerTwoScore;
  }

  inTiebreak() {
    return this.currentGame.isTiebreak();
  }

  getCurrentGameTotalScore() {
    return this.currentGame.getTotalGameScore();
  }

  getCurrentGamePlayerOneScore() {
    return this.currentGame.getPlayerOneScore();
  }

  getCurrentGamePlayerTwoScore() {
    return this.currentGame.getPlayerTwoScore();
  }

  getGameHistoryScoreDisplay() {
    return this.currentGame.getHistoryScoreDisplay();
  }

  getPlayerOneScore() {
    return this.playerOneScore;
  }

  getPlayerTwoScore() {
    return this.playerTwoScore;
  }

  getSetScore() {
    return this.playerOneScore + "-" + this.playerTwoScore;
  }

  getScoreDisplay(playerOneFirst) {
    return this.currentGame.getScoreDisplay(playerOneFirst);
  }

  isMatchTiebreakSet() {
    return this.matchTiebreakSet;
  }

  getCompletedGames() {
    return this.completedGames;
  }
}
