import React from 'react';
import Expo from 'expo';
import {
    Constants,
    Location,
    Permissions,
    MapView
} from 'expo';
import { View, StyleSheet } from 'react-native';
import { Container, Button, Text, Header, Content, Form, Item, Input, H1, Card } from 'native-base';


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
        return (
            <MapView style = {{flex: 1}}
                region={this.state.region}
                onRegionChange={this.onRegionChange}
                showsUserLocation = {
                    true
                }>
                <Container>

                    <Form style={styles.search}>
                        <Item>
                            <Input placeholder="Destination" />
                        </Item>
                    </Form>
                </Container>

            </MapView>
        );
    }
}


const styles = StyleSheet.create({
    search: {

    },
    title: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 10,
    }
});
