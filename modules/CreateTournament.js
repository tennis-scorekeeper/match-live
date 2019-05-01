import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import {isValidInput} from './util.js';

export default class Login extends React.Component {

	constructor(props) {
		super(props);
        this.state = {email: this.props.navigation.state.params.email, tournamentName: '', tournamentDate: ''};
	}

	static navigationOptions =
	{
		title: 'Create Tournament',
	};

	buttonClickListener = () => {
		const {replace} = this.props.navigation;
		var rootRef = firebase.database().ref();
    var userRef = rootRef.child("users");
    var tournamentsRef = rootRef.child("tournaments");
		var {email, tournamentName, tournamentDate} = this.state;
		var fbEmail = email.toLowerCase().replace('.',',');

		if (tournamentName.length > 0 && tournamentDate.length > 0
				&& isValidInput(tournamentName) && isValidInput(tournamentDate)) {
      var res = tournamentsRef.push({name: tournamentName, date: tournamentDate, admin: fbEmail});
			var tournamentId = res.path.substring(res.path.indexOf('-'));
			userRef.child(fbEmail).child('tournaments').once('value').then(ss => {
				var tmp = [];
				if (ss.exists()) {
					tmp = ss.val()
				}
				tmp.push(tournamentId);
				userRef.child(fbEmail).update({tournaments: tmp});
				this.props.navigation.state.params.onGoBack();
				this.props.navigation.goBack();
			});
		} else {
			replace('CreateTournament', {error: true, email: email, onGoBack: this.props.navigation.state.params.onGoBack});
		}
	}
	
    render(){
		let errorLabel;
		if (this.props.navigation.state.params.error) {
			errorLabel = <Text style={styles.errorLabels}>Please fill out all fields with valid input!</Text>;
		} else {
			errorLabel = <Text></Text>;
		}
		return(
			<ScrollView style={styles.mainView}>
				<View style={styles.subView}>
					{errorLabel}
				</View>
				<View style={styles.subView}>
					<View>
						<Text style={styles.labels}>Tournament Name</Text>
						<TextInput 
							style={styles.inputs}
							defaultValue={this.state.tournamentName}
							onChangeText={(tournamentName) => this.setState({tournamentName})}
						/>
					</View>
				</View>
				<View style={styles.subView}>
					<View>
						<Text style={styles.labels}>Start Date</Text>
						<TextInput 
							style={styles.inputs}
							defaultValue={this.state.tournamentDate}
							onChangeText={(tournamentDate) => this.setState({tournamentDate})}
						/>
					</View>
				</View>
				<View style={styles.subView}>
					<TouchableOpacity onPress={this.buttonClickListener} style={styles.buttons}>
						<Text style={styles.buttonText}>Create</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	mainView: {
		paddingTop:20,
	},
	subView: {
		alignItems:'center',
		margin:20,
	},
	inputs: {
		justifyContent: 'center',
		alignItems: 'center',
        width: 250,
		height: 50,
		fontSize: 16,
		borderBottomColor: 'black',
		borderBottomWidth: 2,
	},
	labels: {
		  fontWeight: 'bold',
		  color: 'black',
		  fontSize: 16,
	  },
	errorLabels: {
		fontWeight: 'bold',
		color: 'red',
		fontSize: 16,
	},
	buttons: {
		  justifyContent: 'center',
		  alignItems: 'center',
		  backgroundColor: 'blue',
		  width: 150,
		  height: 50,
	},
	  buttonText: {
		  fontWeight: 'bold',
		  color: 'white',
		  fontSize: 16,
	}
});
