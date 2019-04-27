import React, {Component} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button} from 'react-native';
import firebase from 'react-native-firebase';

export default class Home extends React.Component {

	 static navigationOptions = {
		title: 'Register',
	  };

	constructor(props) {
		super(props);
		this.state = {email: '', name: '', password: '', cpassword: ''};
	}

	buttonClickListener = () => {
		const {pop} = this.props.navigation;
		var rootRef = firebase.database().ref();
		var userRef = rootRef.child("users");
		const {email, name, password, cpassword} = this.state;
		if (email != '') {
			userRef.child(email).set({password : password, name : name})
			.then(res => {
				if (res == null) {
					pop();
				}
			})
			.catch(err => {
				console.log(err);
			});
		}
	}

    render(){
	const {navigate} = this.props.navigation;
		return(
		<View style={styles.mainView}>
			<View style={styles.subView}>
				<Text style={styles.labels}>Email</Text>
				<TextInput 
					style={styles.inputs}
					onChangeText={(email) => this.setState({email})}
				/>
			</View>
			<View style={styles.subView}>
				<Text style={styles.labels}>Full Name</Text>
				<TextInput 
					style={styles.inputs}
					onChangeText={(name) => this.setState({name})}
				/>
			</View>
			<View style={styles.subView}>
				<Text style={styles.labels}>Password</Text>
				<TextInput 
					style={styles.inputs}
					onChangeText={(password) => this.setState({password})}
				/>
			</View>
			<View style={styles.subView}>
				<Text style={styles.labels}>Confirm Password</Text>
				<TextInput 
					style={styles.inputs}
					onChangeText={(cpassword) => this.setState({cpassword})}
				/>
			</View>
			<Button
				title='Submit'
				onPress={this.buttonClickListener} />
		</View>
		);
  }
}

const styles = StyleSheet.create({
  mainView: {
	flex: 1, 
	paddingTop:20,
	justifyContent: 'flex-start',
	alignItems: 'center',
  },
  subView: {
  	flex: 3,
  },
  inputs: {
	justifyContent: 'center',
	alignItems: 'center',
	width: 200,
	height: 35,
	fontSize: 16,
	borderBottomColor: 'black',
	borderBottomWidth: 2,
  },
  labels: {
	fontWeight: 'bold',
	color: 'black',
	fontSize: 16,
  },
  buttons: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: 'blue',
	width: 150,
	height: 35,
	margin: 20,
  },
  buttonText: {
	fontWeight: 'bold',
	color: 'white',
	fontSize: 16,
  }
});