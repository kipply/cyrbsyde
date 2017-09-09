import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebBrowser } from 'expo';
// import { Navigator, NativeModules } from 'react-native';
import * as firebase from "firebase";
import { FireAuth } from 'react-native-firebase-auth';

import { COLOR, ThemeProvider, Button } from 'react-native-material-ui';

import { MonoText } from '../components/StyledText';

const uiTheme = {
    palette: {
        primaryColor: COLOR.green500,
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
};
// const credentials = firebase.auth.GoogleAuthProvider.credential("194804647786-mqj2c9nqeebcgsqh6100okln19u0hfut.apps.googleusercontent.com", "M_ap9dgzFPnVMIPs1Ufakb5T");

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);

        // FireAuth.init({iosClientId: "221641113575-hil4f3ph0sg3bj86inbnfbggmk5q6pdk.apps.googleusercontent.com"}); // This is the CLIENT_ID found in your Google services plist.
    }

    componentDidMount() {
    //   FireAuth.setup(this.onLogin, this.onUserChange, this.onLogout, this.emailVerified, this.onError);
    }
        handleClick = () => {
        // FireAuth.googleLogin();

        //   var provider = new firebase.auth.GoogleAuthProvider();
        //   firebase.auth().signInWithCredential(credentials)
        //       .then()
        //       .catch(function(error) {
        //   });
        console.log(firebase.auth().currentUser);
    }
    render() {
        return (
            <View>
            <ThemeProvider uiTheme = {uiTheme}>
            <Button onPress = {this.handleClick} raised primary text = "LOGIN" / >
            </ThemeProvider>
            </View>
        );
    }
}
