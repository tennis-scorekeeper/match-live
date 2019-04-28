import React, {Component} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
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

    selectMatch(m) {
        console.log(m);
    }

    manageUmpires = () => {
        const {navigate} = this.props.navigation;
        navigate('ManageUmpires', {email: this.state.email, error: null, tournament: this.state.tournament});
    }

    render() {
        const {email, tournament} = this.state;
        var disp = [];
        if (tournament.matches != null) {
            for (var i = 0 ; i < tournament.matches.length; i++) {
                var m = tournament.matches[i];
                disp.push(
                    <TouchableOpacity key={i} onPress={() => this.selectMatch(m)}>
                        <Text style={styles.listing}>{m.p1name} vs. {m.p2name}</Text>
                    </TouchableOpacity>)
            }
        }

        let addUmpire = null;
        if (tournament.admin.replace(',','.') == email.toLowerCase()) {
            addUmpire = <View style={styles.buttonView}>
                            <TouchableOpacity onPress={this.manageUmpires} style={styles.buttons}>
                                <Text style={styles.buttonText}>Manage Umpires</Text>
                            </TouchableOpacity>
                        </View>;
        }

        return(
            <View style={styles.mainView}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>{tournament.name}</Text>
                </View>
                <View style={styles.scrollView}>
                    <ScrollView>
                        {disp}
                    </ScrollView>
                </View>
                <View style={styles.buttonsView}>
                    {addUmpire}
                    <View style={styles.buttonView}>
                        <TouchableOpacity onPress={this.createMatchListener} style={styles.buttons}>
                            <Text style={styles.buttonText}>Create Match</Text>
                        </TouchableOpacity>
                    </View>
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
    titleView: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },
    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold',
    },
	scrollView: {
		flex: 6,
    },
    buttonsRow: {
        flex: 1,
        flexDirection: 'row',
        
    },
    buttonsView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonView: {
        alignItems: 'center',
        margin: 10,
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