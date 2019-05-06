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

export default class CreateMatch extends React.Component {
  constructor(props) {
    super(props);
    var tmp = this.props.navigation.state.params.match;
    this.state = {
      email: this.props.navigation.state.params.email,
      tournamentId: this.props.navigation.state.params.tournamentId,
      match: tmp,
      courtNumber: "",
      tossWinner: tmp.p1name,
      tossChoice: "serve",
      leftOfChair: tmp.p1name,
      rightOfChair: tmp.p2name,
      chairUmpire: ""
    };
  }

  static navigationOptions = {
    title: "Match Setup"
  };

  startMatch = () => {
    const { replace, navigate, pop } = this.props.navigation;
    var {
      email,
      tournamentId,
      match,
      courtNumber,
      tossWinner,
      tossChoice,
      leftOfChair,
      rightOfChair,
      chairUmpire
    } = this.state;

    if (!isValidInput(courtNumber) || !isValidInput(chairUmpire)) {
      this.setState({ error: "invalidInput" });
      replace("Prematch", {
        email: email,
        tournamentId: tournamentId,
        match: match,
        error: "invalidInput",
        onGoBack: this.props.navigation.state.params.onGoBack
      });
    } else if (leftOfChair == rightOfChair) {
      replace("Prematch", {
        email: email,
        tournamentId: tournamentId,
        match: match,
        error: "sameLeftAndRight",
        onGoBack: this.props.navigation.state.params.onGoBack
      });
    } else {
      var p1serve = true;
      var p1left = true;
      var ads = match.scoringFormat == "1";

      if (tossWinner == match.p1name) {
        if (tossChoice == "receive") {
          p1serve = false;
        }
      } else {
        if (tossChoice == "serve") {
          p1serve = false;
        }
      }

      if (leftOfChair == match.p2name) {
        p1left = false;
      }
      pop();
      navigate("MatchInterface", {
        email: email,
        tournamentId: tournamentId,
        match: match,
        p1serve: p1serve,
        p1left: p1left,
        ads: ads,
        matchFormat: parseInt(match.matchFormat),
        onGoBack: this.props.navigation.state.params.onGoBack
      });
    }
  };

  render() {
    let errorLabel;
    const { match } = this.state;
    const { error } = this.props.navigation.state.params;
    if (error == "sameLeftAndRight") {
      errorLabel = (
        <Text style={styles.errorLabels}>
          The left and right of the chair cannot be the same.
        </Text>
      );
    } else if (error == "invalidInput") {
      errorLabel = <Text style={styles.errorLabels}>Invalid input!</Text>;
    } else {
      errorLabel = <Text />;
    }
    return (
      <ScrollView style={styles.mainView}>
        <View style={styles.subView}>{errorLabel}</View>
        <View style={styles.subView2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Toss Winner</Text>
            <Picker
              selectedValue={this.state.tossWinner}
              style={styles.pickers}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ tossWinner: itemValue })
              }
            >
              <Picker.Item label={match.p1name} value={match.p1name} />
              <Picker.Item label={match.p2name} value={match.p2name} />
            </Picker>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Choice</Text>
            <Picker
              selectedValue={this.state.tossChoice}
              style={styles.pickers}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ tossChoice: itemValue })
              }
            >
              <Picker.Item label="Serve" value="serve" />
              <Picker.Item label="Receive" value="receive" />
            </Picker>
          </View>
        </View>
        <View style={styles.subView2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Left of Chair</Text>
            <Picker
              selectedValue={this.state.leftOfChair}
              style={styles.pickers}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ leftOfChair: itemValue })
              }
            >
              <Picker.Item label={match.p1name} value={match.p1name} />
              <Picker.Item label={match.p2name} value={match.p2name} />
            </Picker>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Right of Chair</Text>
            <Picker
              selectedValue={this.state.rightOfChair}
              style={styles.pickers}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ rightOfChair: itemValue })
              }
            >
              <Picker.Item label={match.p2name} value={match.p2name} />
              <Picker.Item label={match.p1name} value={match.p1name} />
            </Picker>
          </View>
        </View>
        <View style={styles.subView2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Chair Umpire</Text>
            <TextInput
              style={styles.inputs}
              onChangeText={chairUmpire => this.setState({ chairUmpire })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Court Number</Text>
            <TextInput
              style={styles.inputs}
              onChangeText={courtNumber => this.setState({ courtNumber })}
            />
          </View>
        </View>
        <View style={styles.subView}>
          <TouchableOpacity onPress={this.startMatch} style={styles.buttons}>
            <Text style={styles.buttonText}>Start Match</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    marginTop: 20
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
