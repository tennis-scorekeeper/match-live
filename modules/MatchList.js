import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import {hashCode} from './hash.js';

export default class MatchList extends React.Component {
    constructor(props) {
		super(props);
        this.state = {email: this.props.navigation.state.params.email, tournament: this.props.navigation.state.params.tournament};
    }

    static navigationOptions =
	{
		title: 'Matches',
    };

    createMatchListener = () => {
        const {replace} = this.props.navigation;
        replace('CreateMatch', {email: this.state.email, error: false, tournament: this.state.tournament});
    }

    render() {
        const {email, tournament} = this.state;
        var disp = [];
        if (tournament.matches != null) {
            for (var i = 0 ; i < tournament.matches.length; i++) {
                var m = tournament.matches[i];
                disp.push(
                    <TouchableOpacity key={i} onPress={() => this.selectTournament(m)}>
                        <Text style={styles.listing}>{m.p1name} vs. {m.p2name}</Text>
                    </TouchableOpacity>)
            }
        }

        return(
            <View style={styles.mainView}>
                <View style={styles.scrollView}>
                    <ScrollView>
                        {disp}
                    </ScrollView>
                </View>
                <View style={styles.buttonsView}>
                    <TouchableOpacity onPress={this.createMatchListener} style={styles.buttons}>
						<Text style={styles.buttonText}>Create Match</Text>
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