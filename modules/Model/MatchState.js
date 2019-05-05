import Set from "./Set.js";

export default class MatchState {
  constructor(
    ads,
    isEightGameProSet,
    matchTiebreakSet,
    oldState,
    restore,
    setScores,
    matchFormat
  ) {
    if (oldState == null && !restore) {
      this.currentSet = new Set(
        ads,
        isEightGameProSet,
        false,
        null,
        false,
        0,
        0
      );
      this.completedSets = [];

      this.playerOneAces = 0;
      this.playerTwoAces = 0;

      this.playerOneFaults = 0;
      this.playerOneDoubleFaults = 0;
      this.playerTwoFaults = 0;
      this.playerTwoDoubleFaults = 0;

      this.playerOneTimeViolations = 0;
      this.playerTwoTimeViolations = 0;

      this.playerOneCodeViolations = [];
      this.playerTwoCodeViolations = [];

      this.faulted = false;
      this.adRule = ads;

      this.eightGameProSet = isEightGameProSet;
      this.hasMatchTiebreakSet = matchTiebreakSet;

      this.playerOneForfeit = false;
      this.playerTwoForfeit = false;
    } else if (restore) {
      this.completedSets = [];
      var i = 0;
      for (i = 0; i < setScores.length - 2; i += 2) {
        this.completedSets.push(
          new Set(
            ads,
            isEightGameProSet,
            false,
            null,
            true,
            setScores[i],
            setScores[i + 1]
          )
        );
      }
      if (matchFormat == 2 && this.completedSets.length == 2) {
        this.currentSet = new Set(
          ads,
          isEightGameProSet,
          true,
          null,
          true,
          setScores[setScores.length - 2],
          setScores[setScores.length - 1]
        );
      } else {
        this.currentSet = new Set(
          ads,
          isEightGameProSet,
          false,
          null,
          true,
          setScores[setScores.length - 2],
          setScores[setScores.length - 1]
        );
      }
      this.playerOneAces = 0;
      this.playerTwoAces = 0;

      this.playerOneFaults = 0;
      this.playerOneDoubleFaults = 0;
      this.playerTwoFaults = 0;
      this.playerTwoDoubleFaults = 0;

      this.playerOneTimeViolations = 0;
      this.playerTwoTimeViolations = 0;

      this.playerOneCodeViolations = [];
      this.playerTwoCodeViolations = [];

      this.faulted = false;
      this.adRule = ads;

      this.eightGameProSet = isEightGameProSet;
      this.hasMatchTiebreakSet = matchTiebreakSet;

      this.playerOneForfeit = false;
      this.playerTwoForfeit = false;
    } else {
      this.currentSet = new Set(
        false,
        false,
        false,
        oldState.currentSet,
        false,
        0,
        0
      );
      this.completedSets = [];
      oldState.completedSets.forEach(completedSet => {
        this.completedSets.push(
          new Set(false, false, false, completedSet, false, 0, 0)
        );
      });

      this.playerOneAces = oldState.playerOneAces;
      this.playerTwoAces = oldState.playerTwoAces;

      this.playerOneFaults = oldState.playerOneFaults;
      this.playerOneDoubleFaults = oldState.playerOneDoubleFaults;
      this.playerTwoFaults = oldState.playerTwoFaults;
      this.playerTwoDoubleFaults = oldState.playerTwoDoubleFaults;

      this.playerOneTimeViolations = oldState.playerOneTimeViolations;
      this.playerTwoTimeViolations = oldState.playerTwoTimeViolations;

      this.playerOneCodeViolations = [];
      // for (CodeViolation code : oldState.playerOneCodeViolations) {
      //     playerOneCodeViolations.add(new CodeViolation(code));
      // }

      this.playerTwoCodeViolations = [];
      // for (CodeViolation code : oldState.playerTwoCodeViolations) {
      //     playerTwoCodeViolations.add(new CodeViolation(code));
      // }

      this.faulted = false;
      this.adRule = oldState.adRule;
      this.eightGameProSet = oldState.eightGameProSet;
      this.hasMatchTiebreakSet = oldState.hasMatchTiebreakSet;

      this.playerOneForfeit = oldState.playerOneForfeit;
      this.playerTwoForfeit = oldState.playerTwoForfeit;
    }
  }
  incrementPlayerOneScore() {
    var nextMatchState = new MatchState(
      false,
      false,
      false,
      this,
      false,
      null,
      null
    );
    var wonGame = nextMatchState.currentSet.incrementPlayerOneGameScore();
    if (wonGame) {
      var wonSet = nextMatchState.currentSet.incrementPlayerOneScore();
      if (wonSet) {
        nextMatchState.completedSets.push(nextMatchState.currentSet);
        var nextSetMatchTiebreak = false;
        if (
          this.hasMatchTiebreakSet &&
          nextMatchState.completedSets.length == 2
        ) {
          nextSetMatchTiebreak = true;
        }
        nextMatchState.currentSet = new Set(
          this.adRule,
          this.eightGameProSet,
          nextSetMatchTiebreak,
          null,
          false,
          0,
          0
        );
      }
    }
    return nextMatchState;
  }

  incrementPlayerTwoScore() {
    var nextMatchState = new MatchState(
      false,
      false,
      false,
      this,
      false,
      null,
      null
    );
    var wonGame = nextMatchState.currentSet.incrementPlayerTwoGameScore();
    if (wonGame) {
      var wonSet = nextMatchState.currentSet.incrementPlayerTwoScore();
      if (wonSet) {
        nextMatchState.completedSets.push(nextMatchState.currentSet);
        var nextSetMatchTiebreak = false;
        if (
          this.hasMatchTiebreakSet &&
          nextMatchState.completedSets.length == 2
        ) {
          nextSetMatchTiebreak = true;
        }
        nextMatchState.currentSet = new Set(
          this.adRule,
          this.eightGameProSet,
          nextSetMatchTiebreak,
          null,
          false,
          0,
          0
        );
      }
    }
    return nextMatchState;
  }

  playerOneAce() {
    var nextMatchState = incrementPlayerOneScore();
    nextMatchState.playerOneAces += 1;
    return nextMatchState;
  }

  playerTwoAce() {
    var nextMatchState = incrementPlayerTwoScore();
    nextMatchState.playerTwoAces += 1;
    return nextMatchState;
  }

  playerOneFault() {
    if (this.faulted) {
      var nextMatchState = incrementPlayerTwoScore();
      nextMatchState.playerOneDoubleFaults += 1;
      return nextMatchState;
    } else {
      var nextMatchState = new MatchState(
        false,
        false,
        false,
        this,
        false,
        null,
        null
      );
      nextMatchState.faulted = true;
      nextMatchState.playerOneFaults += 1;
      return nextMatchState;
    }
  }

  playerTwoFault() {
    if (this.faulted) {
      var nextMatchState = incrementPlayerOneScore();
      nextMatchState.playerTwoDoubleFaults += 1;
      return nextMatchState;
    } else {
      var nextMatchState = new MatchState(
        false,
        false,
        false,
        this,
        false,
        null,
        null
      );
      nextMatchState.faulted = true;
      nextMatchState.playerTwoFaults += 1;
      return nextMatchState;
    }
  }
  playerOneTimeViolation(pointPenalty) {
    if (pointPenalty) {
      var nextMatchState = incrementPlayerTwoScore();
      nextMatchState.playerOneTimeViolations += 1;
      return nextMatchState;
    } else {
      var nextMatchState = new MatchState(
        false,
        false,
        false,
        this,
        false,
        null,
        null
      );
      nextMatchState.playerOneTimeViolations += 1;
      return nextMatchState;
    }
  }

  playerTwoTimeViolation(pointPenalty) {
    if (pointPenalty) {
      var nextMatchState = incrementPlayerOneScore();
      nextMatchState.playerTwoTimeViolations += 1;
      return nextMatchState;
    } else {
      var nextMatchState = new MatchState(
        false,
        false,
        false,
        this,
        false,
        null,
        null
      );
      nextMatchState.playerTwoTimeViolations += 1;
      return nextMatchState;
    }
  }

  // WILL ADD
  playerOneCodeViolation(penaltyType, penaltyReason, playerName) {
    return this;
  }

  // WILL ADD
  playerTwoCodeViolation(penaltyType, penaltyReason, playerName) {
    return this;
  }
  playerOneSubtractFault() {
    this.playerOneFaults -= 1;
  }

  playerTwoSubtractFault() {
    this.playerTwoFaults -= 1;
  }
  getTotalGames() {
    var total = 0;
    this.completedSets.forEach(set => {
      total += set.getTotalGames();
    });
    total += this.currentSet.getTotalGames();
    return total;
  }
  inTieBreak() {
    return this.currentSet.inTiebreak();
  }

  getCurrentGameTotalScore() {
    return this.currentSet.getCurrentGameTotalScore();
  }

  getCurrentGamePlayerOneScore() {
    return this.currentSet.getCurrentGamePlayerOneScore();
  }

  getCurrentGamePlayerTwoScore() {
    return this.currentSet.getCurrentGamePlayerTwoScore();
  }

  getCurrentSetPlayerOneScore() {
    return this.currentSet.getPlayerOneScore();
  }

  getCurrentSetPlayerTwoScore() {
    return this.currentSet.getPlayerTwoScore();
  }

  getGameHistoryScoreDisplay() {
    return this.currentSet.getGameHistoryScoreDisplay();
  }
  getFaulted() {
    return this.faulted;
  }

  getPlayerOneAces() {
    return this.playerOneAces;
  }

  getPlayerTwoAces() {
    return this.playerTwoAces;
  }

  getPlayerOneFaults() {
    return this.playerOneFaults;
  }

  getPlayerOneDoubleFaults() {
    return this.playerOneDoubleFaults;
  }

  getPlayerTwoFaults() {
    return this.playerTwoFaults;
  }

  getPlayerTwoDoubleFaults() {
    return this.playerTwoDoubleFaults;
  }

  getPlayerOneTimeViolations() {
    return this.playerOneTimeViolations;
  }

  getPlayerTwoTimeViolations() {
    return this.playerTwoTimeViolations;
  }

  getCompletedSets() {
    return this.completedSets;
  }

  getPlayerOneCodeViolations() {
    return this.playerOneCodeViolations;
  }

  getPlayerTwoCodeViolations() {
    return this.playerTwoCodeViolations;
  }

  getPlayerOneForfeit() {
    return this.playerOneForfeit;
  }

  getPlayerTwoForfeit() {
    return this.playerTwoForfeit;
  }
  getSetScores() {
    var result = [];

    this.completedSets.forEach(completedSet => {
      if (completedSet.isMatchTiebreakSet()) {
        result.push(parseInt(completedSet.getCurrentGamePlayerOneScore()));
        result.push(parseInt(completedSet.getCurrentGamePlayerTwoScore()));
      } else {
        result.push(parseInt(completedSet.getPlayerOneScore()));
        result.push(parseInt(completedSet.getPlayerTwoScore()));
      }
    });
    if (this.currentSet.isMatchTiebreakSet()) {
      result.push(parseInt(this.currentSet.getCurrentGamePlayerOneScore()));
      result.push(parseInt(this.currentSet.getCurrentGamePlayerTwoScore()));
    } else {
      result.push(parseInt(this.currentSet.getPlayerOneScore()));
      result.push(parseInt(this.currentSet.getPlayerTwoScore()));
    }

    return result;
  }
}
