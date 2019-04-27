import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import {hashCode} from './hash.js';

export default class Login extends React.Component {
    constructor(props) {
		super(props);
		this.state = {email: this.props.navigation.state.params.email}
	}
    static navigationOptions =
	{
		title: 'Tournaments',
    };
    render() {
        return(
            <Text>{this.state.email}</Text>
        );
    }
}