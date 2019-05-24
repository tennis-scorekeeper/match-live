export default class CodeViolation {
  constructor(name, pen, res, oldCode) {
    this.penaltyNames = ["Warning", "Point Penalty", "Game Penalty", "Default"];
    if (oldCode == null) {
      this.playerName = name;
      this.penalty = pen;
      this.reason = res;
    } else {
      this.playerName = oldCode.playerName;
      this.penalty = oldCode.penalty;
      this.reason = oldCode.reason;
    }
  }

  getPlayerName() {
    return playerName;
  }

  getPenalty() {
    return penaltyNames[penalty];
  }

  getReason() {
    return reason;
  }
}