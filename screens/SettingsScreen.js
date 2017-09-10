import React from 'react';
import { WebBrowser } from 'expo';
import { View, StyleSheet, Text, Image, TextInput, Button } from 'react-native';

import { MonoText } from '../components/StyledText';
import firebase from 'firebase';
import Login from "../components/login";
import Register from "../components/register";


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
  constructor(props){
      super(props);
      this.state = {
          signedIn: firebase.auth().currentUser,
          isLoginScreen : true,
      };
  }
  showLogin(){
      this.setState({isLoginScreen: true})
  }
  showRegister(){
      this.setState({isLoginScreen: false})
  }
  render()  {
    if (!firebase.auth().currentUser){
        return (
          <View style={styles.container}>
                {this.state.isLoginScreen ? <Login screenProps={{ navigation: this.props.navigation }} /> : <Register screenProps={{ navigation: this.props.navigation }} />}

                <View style={styles.inline}>
                <Button
                  onPress={() => this.showLogin()}
                  title="Login"
                  color="blue"
                />
                <Button
                  onPress={() => this.showRegister()}
                  title="Register"
                  color="green"
                />
                </View>
          </View>
        );
    } else {
        return(
        <View style={styles.container}>
          <Text style={styles.title}>{firebase.auth().currentUser.email}</Text>
        </View>
        )
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  title: {
      fontSize: 25,
  },
  inline: {
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      flexDirection:'row',
    }

});
