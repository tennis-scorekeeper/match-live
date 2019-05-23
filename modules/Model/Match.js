import MatchState from "./MatchState";

export default class Match {
  constructor(p1serve, p1left, ads, matchFormatIndex, restore, setScores) {
    if (restore) {
      this.currentMatchState = new MatchState(
        ads,
        matchFormatIndex == 3,
        matchFormatIndex == 2,
        null,
        true,
        setScores,
        matchFormatIndex
      );
      this.pastMatchStates = [];

      this.playerOneServedFirst = p1serve;
      this.playerOneStartedLeft = p1left;
      this.matchFormat = matchFormatIndex;
    } else {
      this.currentMatchState = new MatchState(
        ads,
        matchFormatIndex == 3,
        matchFormatIndex == 2,
        null,
        false,
        null,
        null
      );
      this.pastMatchStates = [];

      this.playerOneServedFirst = p1serve;
      this.playerOneStartedLeft = p1left;
      this.matchFormat = matchFormatIndex;
    }
  }
  checkInTiebreak() {
    return this.currentMatchState.inTieBreak();
  }
  checkPlayerOneServing() {
    var totalGames = this.currentMatchState.getTotalGames();

    var playerOneServing;
    if (totalGames % 2 == 0) {
      if (this.playerOneServedFirst) {
        playerOneServing = true;
      } else {
        playerOneServing = false;
      }
    } else {
      if (this.playerOneServedFirst) {
        playerOneServing = false;
      } else {
        playerOneServing = true;
      }
    }

    if (this.currentMatchState.inTieBreak()) {
      var tiebreakPoints = this.currentMatchState.getCurrentGameTotalScore();
      if (tiebreakPoints == 0) {
        return playerOneServing;
      } else {
        var temp = Math.floor((tiebreakPoints - 1) / 2);
        if (temp % 2 == 1) {
          return playerOneServing;
        } else {
          return !playerOneServing;
        }
      }
    } else {
      return playerOneServing;
    }
  }

  checkPlayerOneLeftSide() {
    var totalGames = this.currentMatchState.getTotalGames();

    var playerOneLeftSide = this.playerOneStartedLeft;
    if (totalGames == 0) {
      return this.playerOneStartedLeft;
    }

    if (Math.floor((totalGames - 1) / 2) % 2 == 0) {
      playerOneLeftSide = !playerOneLeftSide;
    }

    if (this.currentMatchState.inTieBreak()) {
      var tiebreakPoints = this.currentMatchState.getCurrentGameTotalScore();
      if (Math.floor(tiebreakPoints / 6) % 2 == 1) {
        playerOneLeftSide = !playerOneLeftSide;
      }
    }

    return playerOneLeftSide;
  }

  getGameHistory() {
    var history = [];

    var lastPlayerOneGameScore = this.currentMatchState.getCurrentGamePlayerOneScore();
    var lastPlayerTwoGameScore = this.currentMatchState.getCurrentGamePlayerTwoScore();

    var i = this.pastMatchStates.length - 1;

    while (i >= 0 && history.length < 5) {
      var historyCurrentState = this.pastMatchStates[i];

      if (
        historyCurrentState.getCurrentSetPlayerOneScore() !=
        this.currentMatchState.getCurrentSetPlayerOneScore()
      ) {
        break;
      }
      if (
        historyCurrentState.getCurrentSetPlayerTwoScore() !=
        this.currentMatchState.getCurrentSetPlayerTwoScore()
      ) {
        break;
      }

      if (
        historyCurrentState.getCurrentGamePlayerOneScore() !=
          lastPlayerOneGameScore ||
        historyCurrentState.getCurrentGamePlayerTwoScore() !=
          lastPlayerTwoGameScore
      ) {
        history.push(historyCurrentState);
        lastPlayerOneGameScore = historyCurrentState.getCurrentGamePlayerOneScore();
        lastPlayerTwoGameScore = historyCurrentState.getCurrentGamePlayerTwoScore();
      }
      i--;
    }
    var result = "";

    history.forEach(matchState => {
      result +=
        matchState.getCurrentSetPlayerOneScore() +
        "-" +
        matchState.getCurrentSetPlayerTwoScore();
      result += " (" + matchState.getGameHistoryScoreDisplay() + ")\n";
    });

    return result;
  }

  getFaulted() {
    return this.currentMatchState.getFaulted();
  }

  getCurrentGameScore() {
    return this.currentMatchState.currentSet.getScoreDisplay(
      this.checkPlayerOneServing()
    );
  }

  getCurrentGamePlayerOneScore() {
    return this.currentMatchState.getCurrentGamePlayerOneScore();
  }

  getCurrentGamePlayerTwoScore() {
    return this.currentMatchState.getCurrentGamePlayerTwoScore();
  }

  getPlayerOneAces() {
    return this.currentMatchState.getPlayerOneAces();
  }

  getPlayerTwoAces() {
    return this.currentMatchState.getPlayerTwoAces();
  }

  getPlayerOneFaults() {
    return this.currentMatchState.getPlayerOneFaults();
  }

  getPlayerOneDoubleFaults() {
    return this.currentMatchState.getPlayerOneDoubleFaults();
  }

  getPlayerTwoFaults() {
    return this.currentMatchState.getPlayerTwoFaults();
  }

  getPlayerTwoDoubleFaults() {
    return this.currentMatchState.getPlayerTwoDoubleFaults();
  }
  getPlayerOneTimeViolations() {
    return this.currentMatchState.getPlayerOneTimeViolations();
  }

  getPlayerTwoTimeViolations() {
    return this.currentMatchState.getPlayerTwoTimeViolations();
  }

  getPlayerOneCodeViolations() {
    return this.currentMatchState.getPlayerOneCodeViolations();
  }

  getPlayerTwoCodeViolations() {
    return this.currentMatchState.getPlayerTwoCodeViolations();
  }

  incrementPlayerOneScore() {
    this.pastMatchStates.push(this.currentMatchState);

    this.currentMatchState = this.currentMatchState.incrementPlayerOneScore();
  }

  incrementPlayerTwoScore() {
    this.pastMatchStates.push(this.currentMatchState);

    this.currentMatchState = this.currentMatchState.incrementPlayerTwoScore();
  }
  let() {
    if (this.currentMatchState.getFaulted()) {
      var nextMatchState = new MatchState(
        false,
        false,
        false,
        this.currentMatchState,
        false,
        null,
        null
      );
      if (this.checkPlayerOneServing()) {
        nextMatchState.playerOneSubtractFault();
      } else {
        nextMatchState.playerTwoSubtractFault();
      }
      this.pastMatchStates.push(this.currentMatchState);
      this.currentMatchState = nextMatchState;
    }
  }

  serverAced() {
    this.pastMatchStates.push(this.currentMatchState);
    if (this.checkPlayerOneServing()) {
      this.currentMatchState = this.currentMatchState.playerOneAce();
    } else {
      this.currentMatchState = this.currentMatchState.playerTwoAce();
    }
  }

  serverFaulted() {
    this.pastMatchStates.push(this.currentMatchState);
    if (this.checkPlayerOneServing()) {
      this.currentMatchState = this.currentMatchState.playerOneFault();
    } else {
      this.currentMatchState = this.currentMatchState.playerTwoFault();
    }
  }
  playerOneTimeViolation(pointPenalty) {
    this.pastMatchStates.push(this.currentMatchState);
    this.currentMatchState = this.currentMatchState.playerOneTimeViolation(
      pointPenalty
    );
  }

  playerTwoTimeViolation(pointPenalty) {
    this.pastMatchStates.push(this.currentMatchState);
    this.currentMatchState = this.currentMatchState.playerTwoTimeViolation(
      pointPenalty
    );
  }

  playerOneCodeViolation(penaltyType, penaltyReason, playerName) {
    this.pastMatchStates.push(this.currentMatchState);
    this.currentMatchState = this.currentMatchState.playerOneCodeViolation(
      penaltyType,
      penaltyReason,
      playerName
    );
  }

  playerTwoCodeViolation(penaltyType, penaltyReason, playerName) {
    this.pastMatchStates.push(this.currentMatchState);
    this.currentMatchState = this.currentMatchState.playerTwoCodeViolation(
      penaltyType,
      penaltyReason,
      playerName
    );
  }

  undo() {
    if (this.pastMatchStates.length > 0) {
      this.currentMatchState = this.pastMatchStates.pop();
    }
  }

  checkIfMatchOver() {
    if (
      this.currentMatchState.getPlayerOneForfeit() ||
      this.currentMatchState.getPlayerTwoForfeit()
    ) {
      return true;
    }
    var setsNeededToWin;
    if (this.matchFormat == 0) {
      setsNeededToWin = 3;
    } else if (this.matchFormat == 1 || this.matchFormat == 2) {
      setsNeededToWin = 2;
    } else {
      setsNeededToWin = 1;
    }

    var matchSets = currentMatchState.getCompletedSets();
    var playerOneSets = 0;
    var playerTwoSets = 0;

    matchSets.forEach(set => {
      if (set.getPlayerOneScore() > set.getPlayerTwoScore()) {
        playerOneSets += 1;
      } else {
        playerTwoSets += 1;
      }
    });
    if (playerOneSets == setsNeededToWin || playerTwoSets == setsNeededToWin) {
      return true;
    }
    return false;
  }

  checkPlayerOneWinningMatch() {
    if (this.currentMatchState.getPlayerTwoForfeit()) {
      return true;
    }
    if (this.currentMatchState.getPlayerOneForfeit()) {
      return false;
    }
    var matchSets = this.currentMatchState.getCompletedSets();
    var playerOneSets = 0;
    var playerTwoSets = 0;

    matchSets.forEach(set => {
      if (set.getPlayerOneScore() > set.getPlayerTwoScore()) {
        playerOneSets += 1;
      } else {
        playerTwoSets += 1;
      }
    });

    if (playerOneSets > playerTwoSets) {
      return true;
    }
    return false;
  }

  getSetScoreString() {
    var result = "";

    if (this.checkPlayerOneWinningMatch()) {
      var matchSets = this.currentMatchState.getCompletedSets();
      matchSets.forEach(set => {
        if (set.isMatchTiebreakSet()) {
          result += set.getPlayerOneScore() + "-" + set.getPlayerTwoScore();
        } else {
          var completedGames = set.getCompletedGames();
          var lastGame = completedGames[completedGames.length - 1];
          if (lastGame.isTiebreak()) {
            result +=
              set.getPlayerOneScore() +
              "-" +
              set.getPlayerTwoScore() +
              "(" +
              Math.min(
                lastGame.getPlayerOneScore(),
                lastGame.getPlayerTwoScore()
              ) +
              "); ";
          } else {
            result +=
              set.getPlayerOneScore() + "-" + set.getPlayerTwoScore() + "; ";
          }
        }
      });
    } else {
      var matchSets = this.currentMatchState.getCompletedSets();
      matchSets.forEach(set => {
        if (set.isMatchTiebreakSet()) {
          result += set.getPlayerTwoScore() + "-" + set.getPlayerOneScore();
        } else {
          var completedGames = set.getCompletedGames();
          if (completedGames.length > 0) {
            var lastGame = completedGames[completedGames.length - 1];
            if (lastGame.isTiebreak()) {
              result +=
                set.getPlayerTwoScore() +
                "-" +
                set.getPlayerOneScore() +
                "(" +
                Math.min(
                  lastGame.getPlayerOneScore(),
                  lastGame.getPlayerTwoScore()
                ) +
                "); ";
            } else {
              result +=
                set.getPlayerTwoScore() + "-" + set.getPlayerOneScore() + "; ";
            }
          }
        }
      });
    }

    return result;
  }
  getSetScores() {
    return this.currentMatchState.getSetScores();
  }
}
