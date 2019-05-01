import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import {hashCode} from './util.js';

export default class TournamentList extends React.Component {
    constructor(props) {
		super(props);
        this.state = {
            email: this.props.navigation.state.params.email, 
            tournaments: this.props.navigation.state.params.tournaments};
	}
    static navigationOptions =
	{
		title: 'Tournaments',
    };

    createTournamentListener = () => {
        const {replace, navigate} = this.props.navigation;
        navigate('CreateTournament', {
                            email: this.state.email, 
                            error: false,
                            onGoBack: () => this.refresh()});
    }

    refresh() {
        this.props.navigation.replace('TournamentList', this.state);
    }

    selectTournament(t) {
        const {navigate} = this.props.navigation;
        navigate('MatchList', {email: this.state.email, tournament: t});
    }

    componentDidMount() {
        var rootRef = firebase.database().ref();
		var userRef = rootRef.child("users");
        var tournamentsRef = rootRef.child("tournaments");
        var {email} = this.state;
        userRef.child(email.toLowerCase().replace('.',',')).once('value').then(ss => {
            tournamentsRef.once('value').then(tss => {
                var tournaments = [];
                if (ss.val().tournaments != null) {
                    ss.val().tournaments.forEach(id => {
                        tournaments.push({id: id, name: tss.child(id).val().name, 
                            date: tss.child(id).val().date})
                    })
                }
                this.setState({tournaments: tournaments});
            });
        });
    }

    render() {
        const {email, tournaments} = this.state;
        var disp = [];
        tournaments.forEach(t => {
            disp.push(
                <TouchableOpacity key={t.id} onPress={() => this.selectTournament(t)}>
                    <Text style={styles.listing}>{t.name} {t.date}</Text>
                </TouchableOpacity>
            )
        });

        return(
            <View style={styles.mainView}>
                <View style={styles.scrollView}>
                    <ScrollView>
                        {disp}
                    </ScrollView>
                </View>
                <View style={styles.buttonsView}>
                    <TouchableOpacity onPress={this.createTournamentListener} style={styles.buttons}>
						<Text style={styles.buttonText}>Create Tournament</Text>
					</TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
	mainView: {
        paddingTop:20,
        flex:1,  
	},
	scrollView: {
		flex: 6,
    },
    buttonsView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    listing: {
        fontSize: 24,
        marginLeft: 50,
        marginBottom: 20,
        color: 'black',
    }
});