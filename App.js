import React, {Component} from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { StackNavigator } from 'react-navigation';
 
import Home from './modules/Home.js' ;
import Login from './modules/Login.js' ;
import Register from './modules/Register.js';
import TournamentList from './modules/TournamentList.js';
import CreateTournament from './modules/CreateTournament.js';
import MatchList from './modules/MatchList.js';
import CreateMatch from './modules/CreateMatch.js';

import {createStackNavigator, createAppContainer} from 'react-navigation';

const MainNavigator = createStackNavigator({
  Home: {screen: Home},
  Login: {screen: Login},
  Register: {screen: Register},
  TournamentList: {screen: TournamentList},
  CreateTournament: {screen: CreateTournament},
  MatchList: {screen: MatchList},
  CreateMatch: {screen: CreateMatch},
});

const App = createAppContainer(MainNavigator);

export default App;