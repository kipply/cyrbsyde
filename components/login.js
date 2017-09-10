import React, { Component } from 'react';
import { Picker, List, FlatList, Text, StyleSheet, View, TextInput, Button } from 'react-native';
// import request from "superagent";
import firebase from 'firebase';

class Login extends Component {
    constructor(props){
    	super(props);
    	this.state = {
    		email: '',
            password: ''
    	};
    }

  componentDidMount(){
	this.componentDidUpdate();
  }
  componentDidUpdate(){
	if(this.props.content && this.state.lastContent !== this.props.content){
		this.setState({lastContent: this.props.content, imageurl: null});
		this.getData(this.props.content);
	}
  }
  firebaseLogin(e, email, password){

          firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        });
    }
  render() {
    return (
        <View>
        <Text style={styles.title}>Log In</Text>
          <Text>Email</Text>
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

              <Button
                  onPress={(e) => this.firebaseLogin(e, this.state.email, this.state.password)}
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

export default Login;
