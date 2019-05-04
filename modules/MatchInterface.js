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
    errorLabel = (
        <Text style={styles.errorLabels}>
          {this.match.getCurrentGameScore()}
        </Text>
      );
      console.log(this.match.getGameHistory());
    return (
      <ScrollView style={styles.mainView}>
        <View style={styles.subView}>{errorLabel}</View>
        <TouchableOpacity
            onPress={this.playerOneScore}
            style={styles.buttons}
          >
            <Text style={styles.buttonText}>Player One</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.playerTwoScore}
            style={styles.buttons}
          >
            <Text style={styles.buttonText}>Player Two</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.undo}
            style={styles.buttons}
          >
            <Text style={styles.buttonText}>Undo</Text>
          </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    marginTop: 20,
  },
  subView: {
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    flex: 1
  },
  subView2: {
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    flexDirection: "row"
  },
  inputs: {
    width: 150,
    height: 50,
    fontSize: 16,
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginLeft: 10,
    marginRight: 10
  },
  labels: {
    fontWeight: "bold",
    color: "black",
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10
  },
  errorLabels: {
    fontWeight: "bold",
    color: "red",
    fontSize: 16
  },
  buttons: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    width: 150,
    height: 50
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16
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
