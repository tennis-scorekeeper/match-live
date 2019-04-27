import React, {Component} from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import firebase from 'react-native-firebase';

export default class Login extends React.Component {

	 static navigationOptions =
	 {
		title: 'Login',
	 };

    render(){
		var rootRef = firebase.database().ref();
		var userRef = rootRef.child("users");
		userRef.once("value", function(ss) {
			ss.forEach(function (css) {
				console.log(css.val().email);
			});
		});
		return(
			<View style={{flex: 1, paddingTop:20}}>
				<Button title={'yes'} />
			</View>
		);
	}
}
