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
    var tmp = this.props.navigation.state.params.match
    this.state = {
      email: this.props.navigation.state.params.email,
      match: tmp,
      matchIndex: this.props.navigation.state.params.matchIndex,
      courtNumber: "",
      tossWinner: tmp.p1name,
      tossChoice: "Serve",
      leftOfChair: tmp.p1name,
      rightOfChair: tmp.p2name,
      chairUmpire: "",
    };
  }

  static navigationOptions = {
    title: "Match Setup"
  };

  startMatch = () => {
    const { replace, navigate } = this.props.navigation;
    var {
      email,
      match,
      matchIndex,
      courtNumber,
      tossWinner,
      tossChoice,
      leftOfChair,
      rightOfChair,
      chairUmpire
    } = this.state;

    if (!isValidInput(courtNumber) || !isValidInput(chairUmpire)) {
      this.setState({ error: 'invalidInput' });
      replace("Prematch", {
        email: email,
        match: match,
        matchIndex: matchIndex,
        error: "invalidInput",
        onGoBack: () => this.refresh()
      });
    }
    if (leftOfChair == rightOfChair) {
      replace("Prematch", {
        email: email,
        match: match,
        matchIndex: matchIndex,
        error: "sameLeftAndRight",
        onGoBack: () => this.refresh()
      });
    }

    var p1serve = true;
    var p1left = true;
    var ads = match.scoringFormat == '1';

    if (tossWinner == match.p1name) {
      if (tossChoice == 'receive') {
        p1serve = false;
      }
    } else {
      if (tossChoice == 'serve') {
        p1serve = false;
      }
    }

    if (leftOfChair == match.p2name) {
      p1left = false;
    }

    navigate("MatchInterface", {
      email: email,
      matchIndex: matchIndex,
      p1serve: p1serve,
      p1left: p1left,
      ads: ads,
      matchFormat: parseInt(match.matchFormat),
    });


  };

  render() {
    let errorLabel;
    const { match } = this.state;
    const { error } = this.props.navigation.state.params;
    console.log(error);
    if (error == 'sameLeftAndRight') {
      errorLabel = (
        <Text style={styles.errorLabels}>
          The left and right of the chair cannot be the same.
        </Text>
      );
    } else if (error == 'invalidInput') {
      errorLabel = (
        <Text style={styles.errorLabels}>
          Invalid input!
        </Text>
      );
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
          <TouchableOpacity
            onPress={this.startMatch}
            style={styles.buttons}
          >
            <Text style={styles.buttonText}>Start Match</Text>
          </TouchableOpacity>
        </View>
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