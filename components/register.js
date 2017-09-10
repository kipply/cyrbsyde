import React, { Component } from 'react';
import { Picker, List, FlatList, Text, StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import firebase from 'firebase';

class Register extends Component {
    constructor(props){
    	super(props);
    	this.state = {
            email : '',
            password : '',
            password2 : '',
            formCompleted : false,
    	};
    }
    firebaseRegister(e, email, password, password2, nav){

      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      Alert.alert(
          'Uh oh!',
          errorMessage,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
    });
    nav.screenProps.navigation.navigate('Settings');
};
    password(password2){
        if (this.state.password != this.state.password2){
            this.state = {
                formCompleted: false
            }
        }
        this.setState({password2})
    }
  render() {

    return (
        <View>
            <Text style={styles.title}>Register</Text>
              <Text>Username</Text>
              <TextInput
                style={{height: 40, backgroundColor: '#fff', padding: 5}}
                placeholder="Enter your email"
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
              />

            <Text>Password</Text>
            <TextInput
              style={{height: 40, backgroundColor: '#fff', padding: 5}}
              placeholder="Enter your password."

              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
          <Text>Confirm</Text>
          <TextInput
            style={{height: 40, backgroundColor: '#fff', padding: 5}}
            placeholder="Enter your password."
            onChangeText={(password2) => this.setState({password2})}
            value={this.state.password2}
          />
              <Button
                  onPress={(e) => this.firebaseRegister(e, this.state.email, this.state.password, this.state.password2, this.props)}
                  title="Let's Go!"
                  color="#841584"
                />
          </View>
    );
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
  }

});


export default Register;
