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

export default class CreateMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.navigation.state.params.email,
      tournament: this.props.navigation.state.params.tournament,
      date: "",
      p1name: "",
      p1from: "",
      p2name: "",
      p2from: "",
      round: "",
      division: "",
      matchFormat: "1",
      scoringFormat: "1",
      referee: ""
    };
  }

  static navigationOptions = {
    title: "Create Match"
  };

  buttonClickListener = () => {
    const { replace } = this.props.navigation;
    var rootRef = firebase.database().ref();
    var {
      email,
      tournament,
      date,
      p1name,
      p1from,
      p2name,
      p2from,
      round,
      division,
      matchFormat,
      scoringFormat,
      referee
    } = this.state;
    var tournamentRef = rootRef.child("tournaments").child(tournament.id);
    if (
      p1name.length > 0 &&
      p2name.length > 0 &&
      isValidInput(p1name) &&
      isValidInput(p1from) &&
      isValidInput(p2name) &&
      isValidInput(p2from) &&
      isValidInput(round) &&
      isValidInput(division) &&
      isValidInput(referee) &&
      isValidInput(date)
    ) {
      var newMatch = {
        date: date,
        p1name: p1name,
        p1from: p1from,
        p2name: p2name,
        p2from: p2from,
        round: round,
        division: division,
        matchFormat: matchFormat,
        scoringFormat: scoringFormat,
        referee: referee,
        started: false,
        done: false,
        setScores: "",
        gameScore: "",
      };
      tournamentRef
        .child("matches")
        .once("value")
        .then(ss => {
          var tmp = [];
          if (ss.exists()) {
            tmp = ss.val();
          }
          tmp.push(newMatch);
          tournamentRef.update({ matches: tmp });
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
        });
    } else {
      replace("CreateMatch", {
        error: true,
        email: email,
        tournament: tournament,
        onGoBack: this.props.navigation.state.params.onGoBack
      });
    }
  };

  render() {
    let errorLabel;
    if (this.props.navigation.state.params.error) {
      errorLabel = (
        <Text style={styles.errorLabels}>
          Please use valid inputs and fill player names
        </Text>
      );
    } else {
      errorLabel = <Text />;
    }
    return (
      <ScrollView style={styles.mainView}>
        <View style={styles.subView}>{errorLabel}</View>
        <View style={styles.subView}>
          <View>
            <Text style={styles.labels}>Date</Text>
            <TextInput
              style={styles.inputs}
              defaultValue={this.state.date}
              onChangeText={date => this.setState({ date })}
            />
          </View>
        </View>
        <View style={styles.subView2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Player 1 Name</Text>
            <TextInput
              style={styles.inputs}
              defaultValue={this.state.p1name}
              onChangeText={p1name => this.setState({ p1name })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>From</Text>
            <TextInput
              style={styles.inputs}
              defaultValue={this.state.p1from}
              onChangeText={p1from => this.setState({ p1from })}
            />
          </View>
        </View>
        <View style={styles.subView2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Player 2 Name</Text>
            <TextInput
              style={styles.inputs}
              defaultValue={this.state.p2name}
              onChangeText={p2name => this.setState({ p2name })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>From</Text>
            <TextInput
              style={styles.inputs}
              defaultValue={this.state.p2from}
              onChangeText={p2from => this.setState({ p2from })}
            />
          </View>
        </View>
        <View style={styles.subView2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Round</Text>
            <TextInput
              style={styles.inputs}
              defaultValue={this.state.round}
              onChangeText={round => this.setState({ round })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Division</Text>
            <TextInput
              style={styles.inputs}
              defaultValue={this.state.division}
              onChangeText={division => this.setState({ division })}
            />
          </View>
        </View>
        <View style={styles.subView}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Match Format</Text>
            <Picker
              selectedValue={this.state.matchFormat}
              style={styles.pickerLong}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ matchFormat: itemValue })
              }
            >
              <Picker.Item label="Best of three tiebreak sets" value="1" />
              <Picker.Item label="Best of five tiebreak sets" value="0" />
              <Picker.Item
                label="Best of two tiebreak sets and match tiebreak"
                value="2"
              />
              <Picker.Item label="Eight game pro-set" value="3" />
              <Picker.Item label="Six game pro-set" value="4" />
            </Picker>
          </View>
        </View>
        <View style={styles.subView2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Scoring Format</Text>
            <Picker
              selectedValue={this.state.scoringFormat}
              style={styles.pickers}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ scoringFormat: itemValue })
              }
            >
              <Picker.Item label="Regular" value="1" />
              <Picker.Item label="No-Ad" value="0" />
            </Picker>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labels}>Referee</Text>
            <TextInput
              style={styles.inputs}
              defaultValue={this.state.referee}
              onChangeText={referee => this.setState({ referee })}
            />
          </View>
        </View>
        <View style={styles.subView}>
          <TouchableOpacity
            onPress={this.buttonClickListener}
            style={styles.buttons}
          >
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {},
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
