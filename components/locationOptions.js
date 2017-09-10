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
		this.getData(props.content.value, props.latitude, props.longitude);
  }

  select(e, item){
      this.state.content = item.address
      console.log(item);
  }
  render() {
    if (this.props.content.value){
    return (
        <View>
        <FlatList
          data={this.state.suggestions}
          renderItem={({item}) => <Text style={styles.item} onPress={(e) => this.select(e, item)}>{ item.address }</Text>}
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
    item: {
        borderWidth: 1,
        borderColor: '#d6d7da',
    }
});

export default LocationOptions;
