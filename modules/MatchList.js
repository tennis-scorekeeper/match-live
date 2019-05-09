import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import firebase from "react-native-firebase";

export default class MatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.navigation.state.params.email,
      tournament: this.props.navigation.state.params.tournament
    };
  }

  static navigationOptions = {
    title: "Matches"
  };

  refresh() {
    this.props.navigation.replace("MatchList", this.state);
  }

  componentDidMount() {
    var rootRef = firebase.database().ref();
    var tournamentsRef = rootRef.child("tournaments");
    var { email, tournament } = this.state;
    tournamentsRef
      .child(tournament.id)
      .once("value")
      .then(tss => {
        this.setState({
          tournament: {
            id: tournament.id,
            name: tss.val().name,
            date: tss.val().date,
            admin: tss.val().admin,
            matches: tss.val().matches,
            umpires: tss.val().umpires
          }
        });
      });
  }

  createMatchListener = () => {
    const { navigate } = this.props.navigation;
    navigate("CreateMatch", {
      email: this.state.email,
      error: false,
      tournament: this.state.tournament,
      onGoBack: () => this.refresh()
    });
  };

  startMatch(m) {
    this.props.navigation.navigate("Prematch", {
      email: this.state.email,
      tournamentId: this.state.tournament.id,
      match: m,
      onGoBack: () => this.refresh()
    });
  }

  resumeMatch(m) {
    this.props.navigation.navigate("MatchInterface", {
      email: this.state.email,
      tournamentId: this.state.tournament.id,
      match: m,
      p1serve: true,
      p1left: true,
      ads: true,
      matchFormat: 0,
      onGoBack: () => this.refresh()
    });
  }

  resetMatch(m) {
    var matchRef = firebase
      .database()
      .ref()
      .child("tournaments")
      .child(this.state.tournament.id)
      .child("matches")
      .child(m.id);
    matchRef.update({started: false}).then(tmp => {
      this.props.navigation.replace("MatchList", this.state);
    });
  }

  deleteMatch(m) {
    
    this.state.tournament.matches.splice(m.id,1);
    var matchRef = firebase
      .database()
      .ref()
      .child("tournaments")
      .child(this.state.tournament.id);
    var i = 0;
    for (i = 0; i < this.state.tournament.matches.length; i++) {
      this.state.tournament.matches[i].id = i;
    }
    matchRef.update({matches: this.state.tournament.matches}).then(tmp => {
      this.props.navigation.replace("MatchList", this.state);
    });
  }

  selectMatch(m) {
    const { navigate } = this.props.navigation;
    if (m.started) {
      if (m.umpire == this.state.email.toLowerCase().replace(".", ",")) {
        Alert.alert(
          m.p1name + ' vs. ' + m.p2name,
          '',
          [
            {text: 'Resume Match', onPress: () => this.resumeMatch(m)},
            {text: 'Reset Match', onPress: () => this.resetMatch(m)},
            {text: 'Cancel'},
          ],
        );
      } else if (this.state.tournament.admin == this.state.email.toLowerCase().replace(".", ",")) {
        Alert.alert(
          'This match is in progress!',
          'Umpire: ' + m.umpire.replace(",","."),
          [
            {text: 'Reset Match', onPress: () => this.resetMatch(m)},
            {text: 'OK'},
          ],
        );
      } else {
        Alert.alert(
          'This match is in progress!',
          'Umpire: ' + m.umpire.replace(",","."),
          [
            {text: 'OK'},
          ],
        );
      }
    } else {
      Alert.alert(
        m.p1name + ' vs. ' + m.p2name,
        '',
        [
          {text: 'Start Match', onPress: () => this.startMatch(m)},
          {text: 'Delete Match', onPress: () => this.deleteMatch(m)},
          {text: 'Cancel'},
        ],
      );
    }
  }

  manageUmpires = () => {
    const { navigate } = this.props.navigation;
    navigate("ManageUmpires", {
      email: this.state.email,
      error: null,
      tournament: this.state.tournament,
      onGoBack: () => this.refresh()
    });
  };

  render() {
    const { email, tournament } = this.state;
    var disp = [];
    if (tournament.matches != null) {
      var i = 0;
      tournament.matches.forEach(m => {
        m.id = i;
        disp.push(
          <TouchableOpacity key={i} onPress={() => this.selectMatch(m)}>
            <Text style={styles.listing}>
              {m.p1name} vs. {m.p2name}
            </Text>
          </TouchableOpacity>
        );
        i++;
      });
    }

    let addUmpire = null;
    if (
      tournament.admin != null &&
      tournament.admin.replace(",", ".") == email.toLowerCase()
    ) {
      addUmpire = (
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={this.manageUmpires} style={styles.buttons}>
            <Text style={styles.buttonText}>Manage Umpires</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.mainView}>
        <View style={styles.titleView}>
          <Text style={styles.title}>{tournament.name}</Text>
        </View>
        <View style={styles.scrollView}>
          <ScrollView>{disp}</ScrollView>
        </View>
        <View style={styles.buttonsView}>
          {addUmpire}
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={this.createMatchListener}
              style={styles.buttons}
            >
              <Text style={styles.buttonText}>Create Match</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    paddingTop: 20,
    flex: 1
  },
  titleView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold"
  },
  scrollView: {
    flex: 6
  },
  buttonsRow: {
    flex: 1,
    flexDirection: "row"
  },
  buttonsView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  buttonView: {
    alignItems: "center",
    margin: 10
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
  listing: {
    fontSize: 24,
    marginLeft: 50,
    marginBottom: 20,
    color: "black"
  }
});
