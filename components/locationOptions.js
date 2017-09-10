import React, { Component } from 'react';
import { Picker, List, FlatList, Text, StyleSheet, View, Button } from 'react-native';
import request from "superagent";

class LocationOptions extends Component {
    constructor(props){
	super(props);
	this.state = {
		suggestions: [{}, {}, {}],
	};
    }
    // http://127.0.0.1:5000/api/getSearchSuggestions?userLocation=39.9483068,-75.1953933&query=Towne

    getAutocomplete(text, latitude, longitude, callback) {
      request.get("http://ec2-35-182-16-224.ca-central-1.compute.amazonaws.com/api/getSearchResults?userLocation=" + latitude + "," + longitude + "&query=" + text).end(callback);
    }

    getData(text, latitude, longitude){
      console.log("About to make call");
      this.getAutocomplete(text, latitude, longitude, (err, result) => {
          data = JSON.parse(result.text)
       if (data){
           this.state.suggestions = data;
       }
       this.setState({suggestions: data})
      });
 };
  search(e, props){
		this.getData(props.content, props.latitude, props.longitude);
  }
  render() {
    if (this.props.content){
    return (
        <View>
        <FlatList
          data={this.state.suggestions}
          renderItem={({item}) => <Text>{ item.address }</Text>}
           style={styles.select}
        />
                  <Button
                  onPress={(e) => this.search(e, this.props)}
                      title="Search"
                      color="#841584"
                    />
                    </View>
    );}
    else{
        return(null)
    }
  }
}

const styles = StyleSheet.create({
    select: {
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
});

export default LocationOptions;
