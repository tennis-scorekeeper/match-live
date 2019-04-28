import React, {Component} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button, ScrollView} from 'react-native';
import firebase from 'react-native-firebase';
import {hashCode} from './hash.js';

export default class Register extends React.Component {

	static navigationOptions = {
		title: 'Register',
	};

	constructor(props) {
		super(props);
		this.state = {email: '', name: '', password: '', cpassword: '',
						validEmail: true, validName: true, validPassword: true, emailTaken: false};
		if (this.props.navigation.state.params.error) {
			const {fillEmail, fillName, fillPassword} = this.props.navigation.state.params.fillFields;
			const {validEmail, validName, validPassword, emailTaken} = this.props.navigation.state.params.validFields;
			this.state.email=fillEmail;
			this.state.name=fillName;
			this.state.password=fillPassword;
			this.state.validEmail = validEmail;
			this.state.validName = validName;
			this.state.validPassword = validPassword;
			this.state.emailTaken = emailTaken;
		}
	}

	buttonClickListener = () => {
		const {pop, replace} = this.props.navigation;
		var rootRef = firebase.database().ref();
		var userRef = rootRef.child("users");
		const {email, name, password, cpassword} = this.state;
		var validEmail = true;
		var validName = true;
		var validPassword = true;

		if (email.indexOf('#') != -1 || email.indexOf('$') != -1
				|| email.indexOf('[') != -1 || email.indexOf(']') != -1 || email.indexOf('@') == -1) {
			validEmail = false;
		}

		if (name == '' || name.indexOf(' ') == -1) {
			validName = false;
		}

		if (password.length < 6 || password != cpassword) {
			validPassword = false;
		}
		var validFields = {validEmail: validEmail, validName: validName, validPassword: validPassword, emailTaken: false};
		var fillFields = {fillEmail: email, fillName: name, fillPassword: password};

		if (validEmail && validName && validPassword) {
			userRef.child(email.toLowerCase().replace('.',',')).once('value').then(ss => {
				if (ss.exists()) {
					validFields.emailTaken = true;
					replace('Register', {error: true, validFields: validFields, fillFields: fillFields});
				} else {
					userRef.child(email.toLowerCase().replace('.', ',')).set({password : hashCode(password), name : name});
					pop();
				}
			});
			
			// CODE FOR UNIQUE EMAILS BY FIREBASE RULES
			
			// userRef.child(email.toLowerCase().replace('.', ',')).set({password : hashCode(password), name : name})
			// .then(res => {
			// 	if (res == null) {
			// 		pop();
			// 	}
			// })
			// .catch(err => {
			// 	console.log(err);
			// 	validFields.emailTaken = true;
			// 	replace('Register', {error: true, validFields: validFields, fillFields: fillFields});
			// });
		} else {
			replace('Register', {error: true, validFields: validFields, fillFields: fillFields});
		}
	}

  render(){
		let emailLabel, nameLabel, passwordLabel;
		if (this.state.validEmail) {
			if (this.state.emailTaken) {
				emailLabel = <Text style={styles.errorLabels}>Email - Email already in use!</Text>;
			} else {
				emailLabel = <Text style={styles.labels}>Email</Text>;
			}
		} else {
			emailLabel = <Text style={styles.errorLabels}>Email - Invalid Email</Text>;
		}
		if (this.state.validName) {
			nameLabel = <Text style={styles.labels}>Full Name</Text>;
		} else {
			nameLabel = <Text style={styles.errorLabels}>Full Name - Please enter full name</Text>
		}
		if (this.state.validPassword) {
			passwordLabel = <Text style={styles.labels}>Password</Text>;
		} else {
			passwordLabel = <Text style={styles.errorLabels}>Password - Invalid password</Text>;
		}
		return(
			<ScrollView style={styles.mainView}>
				<View style={styles.subView}>
					<View>
						{emailLabel}
						<TextInput 
							style={styles.inputs}
							defaultValue={this.state.email}
							onChangeText={(email) => this.setState({email})}
						/>
					</View>
				</View>
				<View style={styles.subView}>
					<View>
						{nameLabel}
						<TextInput 
							style={styles.inputs}
							defaultValue={this.state.name}
							onChangeText={(name) => this.setState({name})}
						/>
					</View>
				</View>
				<View style={styles.subView}>
					<View>
						{passwordLabel}
						<TextInput 
							style={styles.inputs}
							defaultValue={this.state.password}
							secureTextEntry={true}
							onChangeText={(password) => this.setState({password})}
						/>
					</View>
				</View>
				<View style={styles.subView}>
					<View>
						<Text style={styles.labels}>Confirm Password</Text>
						<TextInput 
							style={styles.inputs}
							secureTextEntry={true}
							onChangeText={(cpassword) => this.setState({cpassword})}
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