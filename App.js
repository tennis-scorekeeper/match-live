import React, {Component} from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { StackNavigator } from 'react-navigation';
 
import Home from './modules/Home.js' ;
import Login from './modules/Login.js' ;
import Register from './modules/Register.js';
 
 
import {createStackNavigator, createAppContainer} from 'react-navigation';

const MainNavigator = createStackNavigator({
  Home: {screen: Home},
  Login: {screen: Login},
  Register: {screen: Register},
});

const App = createAppContainer(MainNavigator);

export default App;