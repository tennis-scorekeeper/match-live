


export default class Game {
  constructor(isTiebreak, tiebreakWin, ad, game) {
    if (game == null) {
      this.playerOneScore = 0;
      this.playerTwoScore = 0;

      this.tiebreak = isTiebreak;
      this.tiebreakWinScore = tiebreakWin;
      this.ads = ad;
    } else {
      this.playerOneScore = game.playerOneScore;
      this.playerTwoScore = game.playerTwoScore;

      this.tiebreak = game.tiebreak;
      this.tiebreakWinScore = game.tiebreakWinScore;
      this.ads = game.ads;
    }
    this.displayScores = ["0", "15", "30", "40", "Ad"];
  }

  incrementPlayerOneScore() {
    if (this.tiebreak) {
      this.playerOneScore++;
      if (
        this.playerOneScore >= this.tiebreakWinScore &&
        this.playerOneScore - this.playerTwoScore > 1
      ) {
        return true;
      }
      return false;
    } else {
      if (this.ads) {
        if (this.playerTwoScore == 4) {
          this.playerTwoScore--;
        } else {
          this.playerOneScore++;
        }
        if (this.playerOneScore == 4 && this.playerTwoScore < 3) {
          return true;
        }
        if (this.playerOneScore == 5) {
          return true;
        }
        return false;
      } else {
        this.playerOneScore++;
        if (this.playerOneScore >= 4) {
          return true;
        }
        return false;
      }
    }
  }

  incrementPlayerTwoScore() {
    if (this.tiebreak) {
      this.playerTwoScore++;
      if (
        this.playerTwoScore >= this.tiebreakWinScore &&
        this.playerTwoScore - this.playerOneScore > 1
      ) {
        return true;
      }
      return false;
    } else {
      if (this.ads) {
        if (this.playerOneScore == 4) {
          this.playerOneScore--;
        } else {
          this.playerTwoScore++;
        }
        if (this.playerTwoScore == 4 && this.playerOneScore < 3) {
          return true;
        }
        if (this.playerTwoScore == 5) {
          return true;
        }
        return false;
      } else {
        this.playerTwoScore++;
        if (this.playerTwoScore >= 4) {
          return true;
        }
        return false;
      }
    }
  }
  getScoreDisplay(playerOneFirst) {
    if (this.tiebreak) {
      if (this.playerOneScore >= this.playerTwoScore) {
        return this.playerOneScore + " - " + this.playerTwoScore;
      } else {
        return this.playerTwoScore + " - " + this.playerOneScore;
      }
    } else {
      if (this.playerOneScore == 4 || this.playerTwoScore == 4) {
        return "Ad";
      }
      if (playerOneFirst) {
        return (
          this.displayScores[this.playerOneScore] + " - " + this.displayScores[this.playerTwoScore]
        );
      } else {
        return (
          this.displayScores[this.playerTwoScore] + " - " + this.displayScores[this.playerOneScore]
        );
      }
    }
  }

  getHistoryScoreDisplay() {
    if (this.tiebreak) {
      return this.playerOneScore + "-" + this.playerTwoScore;
    } else {
      return (
        this.displayScores[this.playerOneScore] + "-" + this.displayScores[this.playerTwoScore]
      );
    }
  }

  getPlayerOneScore() {
    return this.playerOneScore;
  }

  getPlayerTwoScore() {
    return this.playerTwoScore;
  }

  isTiebreak() {
    return this.tiebreak;
  }

  getTotalGameScore() {
    return this.playerOneScore + this.playerTwoScore;
  }
}
