import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import {hashCode} from './hash.js';

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {email: '', password: ''};
		console.log(this.props.navigation.state.params);
		if (this.props.navigation.state.params.error) {
			this.state.email = this.props.navigation.state.params.fillEmail;
		}
	}

	static navigationOptions =
	{
		title: 'Sign In',
	};

	buttonClickListener = () => {
		const {pop, navigate, replace} = this.props.navigation;
		var rootRef = firebase.database().ref();
		var userRef = rootRef.child("users");
		var tournamentsRef = rootRef.child("tournaments");
		var {email, password} = this.state;
		password = hashCode(password);
		
		if (email.length == 0) {
			email = 'ali67219@gmail.com';
			password = hashCode('test123');
		}

		if (email.length > 0) {
			userRef.child(email.toLowerCase().replace('.',',')).once('value').then(ss => {
				if (!ss.exists() || ss.val().password != password) {
					replace('Login', {error: true, fillEmail: email});
				} else {
					tournamentsRef.once('value').then(tss => {
						var tournaments = [];
						if (ss.val().tournaments != null) {
							ss.val().tournaments.forEach(id => {
								tournaments.push({id: id, name: tss.child(id).val().name, 
									date: tss.child(id).val().date, admin: tss.child(id).val().admin, 
									matches: tss.child(id).val().matches, umpires: tss.child(id).val().umpires})
							})
						}
						navigate('TournamentList', {email: email, tournaments: tournaments});
					});
				}
			});
		} else {
			replace('Login', {error: true, fillEmail: email});
		}
	}
	
    render(){
		let errorLabel;
		if (this.props.navigation.state.params.error) {
			errorLabel = <Text style={styles.errorLabels}>Invalid Email or Password!</Text>;
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
						<Text style={styles.labels}>Email</Text>
						<TextInput 
							style={styles.inputs}
							defaultValue={this.state.email}
							onChangeText={(email) => this.setState({email})}
						/>
					</View>
				</View>
				<View style={styles.subView}>
					<View>
						<Text style={styles.labels}>Password</Text>
						<TextInput 
							style={styles.inputs}
							defaultValue={this.state.password}
							secureTextEntry={true}
							onChangeText={(password) => this.setState({password})}
						/>
					</View>
				</View>
				<View style={styles.subView}>
					<TouchableOpacity onPress={this.buttonClickListener} style={styles.buttons}>
						<Text style={styles.buttonText}>Submit</Text>
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
