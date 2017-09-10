import React from 'react';
import Expo from 'expo';
import {
    Constants,
    Location,
    Permissions,
    MapView
} from 'expo';
import { View, StyleSheet, Text, Image, TextInput } from 'react-native';
import { Card, Button } from 'react-native-material-design';
import LocationOptions from "../components/locationOptions";


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
            location: {
                coords: {
                    latitude: 0,
                    longitude: 0
                }
            },
            destination : ''
        };
    }

    componentWillMount() {
        this.getLocationAsync();
        Expo.Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
    }

      updateDestination(destination){
          this.setState({destination});
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
                />
                <LocationOptions content={this.state.destination} longitude={this.state.location.coords.longitude} latitude={this.state.location.coords.latitude}/>
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
    }
});
