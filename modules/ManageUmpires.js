import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Picker } from 'react-native';
import firebase from 'react-native-firebase';
import {hashCode} from './hash.js';

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

	buttonClickListener = () => {
        const {replace} = this.props.navigation;
        var {email, tournament, newUmpire} = this.state;
        var rootRef = firebase.database().ref();
        var userRef = rootRef.child("users");
        var tournamentRef = rootRef.child("tournaments").child(tournament.id);
        newUmpire = newUmpire.toLowerCase().replace('.',',');

        userRef.child(newUmpire).once('value').then(ss => {
            if (!ss.exists()) {
                replace('ManageUmpires', {email: email, error: 'noUser', tournament: tournament});
            } else {
                tournamentRef.child('umpires').once('value').then(tUmpires => {
                    var tumps = [];
                    if (tUmpires.exists()) {
                        tumps = tUmpires.val();
                    }
                    var alreadyAdded = false;
                    tumps.forEach(existingUmpire => {
                        if (existingUmpire == newUmpire) {
                            replace('ManageUmpires', {email: email, error: 'alreadyAdded', tournament: tournament});
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
                            replace('ManageUmpires', 
                                {email: email, 
                                    error: 'success',
                                    tournament: {
                                                id: tournament.id, name: tournament.name, 
                                                    date: tournament.date, 
                                                    admin: tournament.admin, 
                                                    matches: tournament.matches, 
                                                    umpires: tss.val().umpires}});
                        })
                    }
                })
            }
        });
	}
	
    render(){
        const {email, tournament} = this.state;
		let errorLabel = null;
		if (this.props.navigation.state.params.error == 'noUser') {
			errorLabel = <Text style={styles.errorLabels}>Umpire does not exist!</Text>;
		} else if (this.props.navigation.state.params.error == 'alreadyAdded') {
			errorLabel = <Text style={styles.errorLabels}>This umpire has already been added!</Text>;
		} else if (this.props.navigation.state.params.error == 'success') {
			errorLabel = <Text style={styles.successLabels}>Umpire added!</Text>;
        }
        
        var umpires = [];
        if (tournament.umpires != null) {
            tournament.umpires.forEach(umpire => {
                umpires.push(<Text key={umpire} style={styles.listing}>{umpire.replace(',','.')}</Text>)
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
    }
});