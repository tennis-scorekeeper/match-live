import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Picker } from 'react-native';
import firebase from 'react-native-firebase';
import {isValidInput} from './util.js';

export default class ManageUmpires extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
                email: this.props.navigation.state.params.email, 
                tournament: this.props.navigation.state.params.tournament,
                error: this.props.navigation.state.params.error,
                newUmpire: '',
            };
	}

	static navigationOptions =
	{
		title: 'Manage Umpires',
    };
    
    deleteUmpire(umpire) {
        const {replace} = this.props.navigation;
        var {email, tournament} = this.state;
        var rootRef = firebase.database().ref();
        var userRef = rootRef.child("users");
        var tournamentRef = rootRef.child("tournaments").child(tournament.id);
        userRef.child(umpire).once('value').then(ss => {
            var userTournaments = ss.child('tournaments').val();
            for (var i = 0; i < userTournaments.length; i++) {
                if (userTournaments[i] == tournament.id) {
                    userTournaments.splice(i, 1);
                }
            }
            userRef.child(umpire).update({tournaments: userTournaments});
            tournamentRef.once('value').then(tss => {
                var tournamentUmpires = tss.child('umpires').val();
                for (var i = 0; i < tournamentUmpires.length; i++) {
                    if (tournamentUmpires[i] == umpire) {
                        tournamentUmpires.splice(i, 1);
                    }
                }
                tournamentRef.update({umpires: tournamentUmpires});
                this.props.navigation.state.params.onGoBack();
                replace('ManageUmpires', 
                                {email: email, 
                                    error: 'removed',
                                    modedUmpire: umpire,
                                    onGoBack: this.props.navigation.state.params.onGoBack,
                                    tournament: {
                                        id: tournament.id, name: tournament.name, 
                                        date: tournament.date, 
                                        admin: tournament.admin, 
                                        matches: tournament.matches, 
                                        umpires: tournamentUmpires}});
            });
        })
    }

	buttonClickListener = () => {
        const {replace} = this.props.navigation;
        var {email, tournament, newUmpire} = this.state;
        var rootRef = firebase.database().ref();
        var userRef = rootRef.child("users");
        var tournamentRef = rootRef.child("tournaments").child(tournament.id);
        newUmpire = newUmpire.toLowerCase().replace('.',',');
        
        if (!isValidInput(newUmpire)) {
            replace('ManageUmpires', {email: email, error: 'invalidInput', modedUmpire: newUmpire, 
                tournament: tournament, onGoBack: this.props.navigation.state.params.onGoBack});
        } else {
            userRef.child(newUmpire).once('value').then(ss => {
                if (!ss.exists() || newUmpire == '') {
                    replace('ManageUmpires', {email: email, error: 'noUser', modedUmpire: newUmpire, 
                        tournament: tournament, onGoBack: this.props.navigation.state.params.onGoBack});
                } else if (newUmpire == tournament.admin.toLowerCase().replace('.',',')) {
                    replace('ManageUmpires', {email: email, error: 'alreadyAdded', modedUmpire: newUmpire, 
                        tournament: tournament, onGoBack: this.props.navigation.state.params.onGoBack});
                } else {

                    tournamentRef.child('umpires').once('value').then(tUmpires => {
                        var tumps = [];
                        if (tUmpires.exists()) {
                            tumps = tUmpires.val();
                        }
                        var alreadyAdded = false;
                        tumps.forEach(existingUmpire => {
                            if (existingUmpire == newUmpire) {
                                replace('ManageUmpires', {email: email, error: 'alreadyAdded', modedUmpire: newUmpire, 
                                    tournament: tournament, onGoBack: this.props.navigation.state.params.onGoBack});
                                alreadyAdded = true;
                            }
                        });
                        if (!alreadyAdded) {
                            tumps.push(newUmpire);
                            tournamentRef.update({umpires: tumps});

                            var tmp = [];
                            if (ss.child('tournaments').exists()) {
                                tmp = ss.child('tournaments').val();
                            };
                            tmp.push(tournament.id);
                            userRef.child(newUmpire).update({tournaments: tmp});

                            tournamentRef.once('value').then(tss => {
                                this.props.navigation.state.params.onGoBack();
                                replace('ManageUmpires', 
                                    {email: email, 
                                        error: 'success',
                                        modedUmpire: newUmpire,
                                        onGoBack: this.props.navigation.state.params.onGoBack,
                                        tournament: {
                                            id: tournament.id, name: tournament.name, 
                                            date: tournament.date, 
                                            admin: tournament.admin, 
                                            matches: tournament.matches, 
                                            umpires: tss.val().umpires
                                        }
                                    }
                                );
                            })
                        }
                    })
                }
            });
        }
	}
	
    render(){
        const {email, tournament} = this.state;
        const {error, modedUmpire} = this.props.navigation.state.params
		let errorLabel = null;
		if (error == 'noUser') {
			errorLabel = <Text style={styles.errorLabels}>Umpire: {modedUmpire.replace(',','.')} does not exist!</Text>;
		} else if (error == 'alreadyAdded') {
			errorLabel = <Text style={styles.errorLabels}>Umpire: {modedUmpire.replace(',','.')} already added!</Text>;
		} else if (error == 'success') {
			errorLabel = <Text style={styles.successLabels}>Umpire: {modedUmpire.replace(',','.')} added!</Text>;
        } else if (error == 'removed') {
			errorLabel = <Text style={styles.errorLabels}>Umpire: {modedUmpire.replace(',','.')} removed!</Text>;
        } else if (error == 'invalidInput') {
            errorLabel = <Text style={styles.errorLabels}>Invalid input!</Text>;
        }
        
        var umpires = [];
        if (tournament.umpires != null) {
            tournament.umpires.forEach(umpire => {
                umpires.push(
                    <TouchableOpacity key={umpire} onPress={() => this.deleteUmpire(umpire)}>
                        <Text style={styles.listing}>{umpire.replace(',','.')}</Text>
                    </TouchableOpacity>
                )
            })
        }
		return(
			<View style={styles.mainView}>
                <View style={styles.subView}>
                    <Text style={styles.title}>{tournament.name}</Text>
                    {errorLabel}
                </View>
                <View style={styles.subView}>
                    <View style={styles.subView2}>
                        <View style={{flex:3}}>
                            <Text style={styles.labels}>Umpire Email</Text>
                            <TextInput 
                                style={styles.inputs}
                                defaultValue={this.state.newUmpire}
                                onChangeText={(newUmpire) => this.setState({newUmpire})}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <TouchableOpacity onPress={this.buttonClickListener} style={styles.buttons}>
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
					</View>
                </View>
                <View style={styles.subViewMain}>
                    <Text style={styles.subTitle}>Current Umpires</Text>
                    <ScrollView>
                        {umpires}
                    </ScrollView>
                </View>
            </View>
		);
	}
}

const styles = StyleSheet.create({
	mainView: {
        flex: 1
	},
	subView: {
        alignItems:'center',
        justifyContent: 'center',
        marginBottom:20,
        marginLeft:20,
        marginRight:20,
        flex: 1,
    },
    subView2: {
        alignItems: 'center',
        marginBottom:20,
        marginLeft:20,
        marginRight:20,
        flex: 1,
        flexDirection: 'row',
    },
    subViewMain: {
        alignItems:'center',
        marginBottom:20,
        marginLeft:20,
        marginRight:20,
        flex: 6,
    },
    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
    },
	inputs: {
		height: 50,
		fontSize: 16,
		borderBottomColor: 'black',
        borderBottomWidth: 2,
        marginLeft:10,
        marginRight:10,
	},
	labels: {
		fontWeight: 'bold',
		color: 'black',
        fontSize: 16,
        marginLeft:10,
        marginRight:10,
	  },
	errorLabels: {
		fontWeight: 'bold',
		color: 'red',
		fontSize: 16,
    },
    successLabels: {
        fontWeight: 'bold',
		color: 'green',
		fontSize: 16,
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        height: 50,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16,
    },
    listing: {
        fontSize: 20,
        marginTop: 20,
        color: 'black',
    },
    subLarge: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    subSmall: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});