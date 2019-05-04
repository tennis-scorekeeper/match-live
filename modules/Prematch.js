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

  buttonClickListener = () => {
    const { replace } = this.props.navigation;
    var rootRef = firebase.database().ref();
    var {
      email,
      match,
      matchIndex,
      courtNumber,
      tossWinner,
      tossChoice,
      leftOfChair,
      rightOfChair
    } = this.state;

    if (leftOfChair == rightOfChair) {
      replace('Prematch', this.state);
    }

  };

  render() {
    let errorLabel;
    const { match } = this.state;
    const { error, modedUmpire } = this.props.navigation.state.params;
    if (error) {
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
            onPress={this.buttonClickListener}
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
