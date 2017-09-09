import React from 'react';
import Expo from 'expo';
import {
    Constants,
    Location,
    Permissions,
    MapView
} from 'expo';

const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000
};

export default class App extends React.Component {
    state = {
        location: {
            coords: {
                latitude: 0,
                longitude: 0
            }
        },
    };

    componentWillMount() {
        this.getLocationAsync();
        Expo.Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
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
        return ( <
            MapView style = {
                {
                    flex: 1
                }
            }
            initialRegion = {
                {
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            }
            showsUserLocation = {
                true
            }
            />
        );
    }
}
