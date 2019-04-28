import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import firebase from 'react-native-firebase';
import {hashCode} from './hash.js';

export default class Login extends React.Component {
    constructor(props) {
		super(props);
        this.state = {email: this.props.navigation.state.params.email, tournaments: this.props.navigation.state.params.tournaments};
	}
    static navigationOptions =
	{
		title: 'Tournaments',
    };

    createTournamentListener = () => {
        const {replace} = this.props.navigation;
        replace('CreateTournament', {email: this.state.email, error: false});
    }
    render() {
        const {email, tournaments} = this.state;
        var disp = [];
        tournaments.forEach(t => {
            disp.push(<Text key={t.id} style={styles.listing}>{t.name} {t.date}</Text>)
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