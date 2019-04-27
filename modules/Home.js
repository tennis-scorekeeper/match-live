import React, {Component} from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

export default class Home extends React.Component {

	  static navigationOptions = {
		title: 'Welcome',
	  };

    render(){
	const {navigate} = this.props.navigation;
		return(
		<View style={styles.mainView}>
			<TouchableOpacity
				style={styles.buttons}
				onPress={() => navigate('Login', {error: false})}>
				<Text style={styles.buttonText}>Sign In</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.buttons}
				onPress={() => navigate('Register', {error: false})}>
				<Text style={styles.buttonText}>Register</Text>
			</TouchableOpacity>
		  </View>
		);
  }
}

const styles = StyleSheet.create({
  mainView: {
	flex: 1, 
	paddingTop:20,
	justifyContent: 'center',
	alignItems: 'center',
  },
  buttons: {
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: 'blue',
	width: 150,
	height: 50,
	margin: 20,
  },
  buttonText: {
	fontWeight: 'bold',
	color: 'white',
	fontSize: 16,
  }
});