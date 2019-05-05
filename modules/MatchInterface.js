import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Picker
} from "react-native";
import firebase from "react-native-firebase";
import { isValidInput } from "./util.js";
import Match from "./Model/Match.js";

export default class MatchInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.navigation.state.params.email,
      match: this.props.navigation.state.params.match,
      matchIndex: this.props.navigation.state.params.matchIndex,
    };
    this.match = new Match(
      this.props.navigation.state.params.p1serve,
      this.props.navigation.state.params.p1left,
      this.props.navigation.state.params.ads,
      this.props.navigation.state.params.matchFormat
    )
  }

  static navigationOptions = {
    title: "Match Interface"
  };

  playerOneScore = () => {
    this.match.incrementPlayerOneScore();
    this.forceUpdate();
  }

  playerTwoScore = () => {
    this.match.incrementPlayerTwoScore();
    this.forceUpdate();
  }

  undo = () => {
    this.match.undo();
    this.forceUpdate();
  }

  render() {
    var p1name = this.state.match.p1name;
    var p2name = this.state.match.p2name;
    let scoreButtons;
    if (this.match.checkPlayerOneLeftSide()) {
      scoreButtons = (
        <View style={styles.scoreButtonRow}>
          <View style={styles.scoreButtonView}>
            <TouchableOpacity
              onPress={this.playerOneScore}
              style={styles.scoreButton}
            >
              <Text style={styles.scoreButtonText}>{p1name}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scoreButtonView}>
            <TouchableOpacity
              onPress={this.playerTwoScore}
              style={styles.scoreButton}
            >
              <Text style={styles.scoreButtonText}>{p2name}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      scoreButtons = (
        <View style={styles.scoreButtonRow}>
          <View style={styles.scoreButtonView}>
            <TouchableOpacity
              onPress={this.playerTwoScore}
              style={styles.scoreButton}
            >
              <Text style={styles.scoreButtonText}>{p2name}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scoreButtonView}>
            <TouchableOpacity
              onPress={this.playerOneScore}
              style={styles.scoreButton}
            >
              <Text style={styles.scoreButtonText}>{p1name}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (this.match.checkPlayerOneServing()) {
      p1name += '*';
    } else {
      p2name += '*';
    }
    gameScore = (
      <Text style={styles.gameScore}>
        {this.match.getCurrentGameScore()}
      </Text>
    );
    var setScores = this.match.getSetScores();
    while (setScores.length < 10) {
      setScores.push(null);
    }
    var p1SetScoresDisplays = [];
    var p2SetScoresDisplays = [];
    var i;
    for (i = 0; i < setScores.length-2; i += 2) {
      p1SetScoresDisplays.push(
        <View key={i} style={styles.setScoreTop}>
          <Text style={styles.scoreboardText}>
            {setScores[i]}
          </Text>
        </View>
      );
    }
    p1SetScoresDisplays.push(
      <View key={8} style={styles.setScoreTopRight}>
        <Text style={styles.scoreboardText}>
          {setScores[8]}
        </Text>
      </View>
    );

    for (i = 1; i < setScores.length-2; i += 2) {
      p2SetScoresDisplays.push(
        <View key={i} style={styles.setScoreBottom}>
          <Text style={styles.scoreboardText}>
            {setScores[i]}
          </Text>
        </View>
      );
    }
    p2SetScoresDisplays.push(
      <View key={9} style={styles.setScoreBottomRight}>
        <Text style={styles.scoreboardText}>
          {setScores[9]}
        </Text>
      </View>
    );
    
    return (
      <ScrollView style={styles.mainView}>
        <View style={styles.buttonRow}>
          <View style={styles.undoButtonView}>
            <TouchableOpacity
              onPress={this.undo}
              style={styles.undoButton}
            >
              <Text style={styles.undoButtonText}>Undo</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.scoreboard}>
          <View style={styles.scoreboardNameTop}>
            <Text style={styles.scoreboardText}>
              {p1name}
            </Text>
          </View>
          {p1SetScoresDisplays}
        </View>
        <View style={styles.scoreboard}>
          <View style={styles.scoreboardNameBottom}>
            <Text style={styles.scoreboardText}>
              {p2name}
            </Text>
          </View>
          {p2SetScoresDisplays}
        </View>
        <View style={styles.gameScoreView}>
          {gameScore}
        </View>
        {scoreButtons}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
  },
  buttonRow: {
    flex:1,
    flexDirection: "row",
    marginBottom: 20,
  },
  undoButtonView: {
    flex:1,
    alignItems:'flex-end',
  },
  undoButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    width: 75,
    height: 40,
  },
  undoButtonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  scoreboard: {
    alignItems: "center",
    marginLeft: 75,
    marginRight: 75,
    flex: 1,
    flexDirection: "row"
  },
  scoreboardNameTop: {
    flex: 3,
    borderColor: 'black',
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  scoreboardNameBottom: {
    flex: 3,
    borderColor: 'black',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  setScoreTop: {
    flex: 1,
    borderColor: 'black',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  setScoreTopRight: {
    flex: 1,
    borderColor: 'black',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  setScoreBottom: {
    flex: 1,
    borderColor: 'black',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  setScoreBottomRight: {
    flex: 1,
    borderColor: 'black',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  scoreboardText: {
    color: 'black',
    fontSize: 16,
  },
  gameScoreView: {
    alignItems: "center",
    margin: 20,
    flex: 1
  },
  gameScore: {
    fontWeight: "bold",
    color: "black",
    fontSize: 48,
  },
  scoreButtonRow: {
    flex:1,
    flexDirection: "row",
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  scoreButtonView: {
    flex: 1,
    alignItems: "center",
  },
  scoreButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    width: 125,
    height: 50,
  },
  scoreButtonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  picker: {
    fontSize: 16,
    width: 150
  },
  pickerLong: {
    fontSize: 16,
    width: 300
  }
});
