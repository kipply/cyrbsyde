import React from 'react';
import Expo from 'expo';
import {
    Constants,
    Location,
    Permissions,
    MapView
} from 'expo';
import { View, StyleSheet, Text, Image, TextInput, FlatList, Button } from 'react-native';
import LocationOptions from "../components/locationOptions";
import request from "superagent";


const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000
};

export default class App extends React.Component {
    static navigationOptions = {
      title: 'Map',
    };
    constructor(props){
        super(props);
        this.state = {
            suggestions: [{}, {}, {}],
            location: {
                coords: {
                    latitude: 0,
                    longitude: 0
                }
            },
            destination : ''
            dest: {
                lat: 0,
                long: 0
            }
        };
    }

    componentWillMount() {
        this.getLocationAsync();
        Expo.Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
    }

      updateDestination(destination){
          this.setState({destination: destination});
      }
    async getLocationAsync() {
        const {
            Location,
            Permissions
        } = Expo;
        const {
            status
        } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            return Location.getCurrentPositionAsync({
                enableHighAccuracy: true
            });
        } else {
            throw new Error('Location permission not granted');
        }
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
  search(e, destination, lat, long){
        this.getData(destination, lat, long);
  }

    locationChanged = (location) => {
        region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.05,
            },
            this.setState({
                location,
                region
            })
    }
    render() {
        return (
            <View style={styles.container}>
            <MapView style = {styles.map}
                region={this.state.region}
                onRegionChange={this.onRegionChange}
                showsUserLocation = {true}>

            </MapView>
            <View style={styles.top}>
                <Text style={styles.title}>{this.state.title}</Text>
                <TextInput
                  style={{height: 40, backgroundColor: '#fff', padding: 5}}
                  placeholder="Type in your destination!"
                  onChangeText={(text) => this.updateDestination(text)}
                  value={this.state.destination}
                />
                <View>
                <FlatList
                  data={this.state.suggestions}
                  renderItem={({item}) => <Text style={styles.item} onPress={(text) => this.updateDestination(item.address)}>{ item.address }</Text>}
                   style={styles.select}
                />
                <Button
                onPress={(e) => this.search(e, this.state.destination, this.state.location.coords.latitude,  this.state.location.coords.longitude)}
                  title="Search"
                  color="#841584"
                  text="Search"
                  />
                </View>
            </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'flex-end',
  alignItems: 'center',
},
map: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
    title: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 10,
    },
    top: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    select: {
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    item: {
        borderWidth: 1,
        borderColor: '#d6d7da',
    }
});
