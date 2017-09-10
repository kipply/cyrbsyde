import React from 'react';
import Expo from 'expo';
import {
    Constants,
    Location,
    Permissions,
    MapView
} from 'expo';
import { View, StyleSheet, Text, Image, TextInput, FlatList, Button, TouchableHighlight, Modal, TouchableOpacity } from 'react-native';
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
            suggestions: [],
            location: {
                coords: {
                    latitude: 0,
                    longitude: 0
                }
            },
            markers: [],
            destination : '',
            dest: {
                lat: 0,
                long: 0,
                name: ""
            },
            methods: [],
            best_method: {

            },
            modalVisible: false
        };
    }

      _renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.button}>
            <Text>{text}</Text>
          </View>
        </TouchableOpacity>
      );

      _renderModalContent = () => (
        <View style={styles.modalContent}>
          <Text>Hello!</Text>
          {this._renderButton('Close', () => this.setState({ visibleModal: null }))}
        </View>
      );


      setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }

    componentWillMount() {
            this.setModalVisible(false)

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
      this.getAutocomplete(text, latitude, longitude, (err, result) => {
          data = JSON.parse(result.text)
       if (data){
           this.state.suggestions = data;
       }
       this.setState({suggestions: data})
      });
  }
  // http://ec2-35-182-16-224.ca-central-1.compute.amazonaws.com/api/getDirections?origin=51.5033640,-0.1276250&destination=51.5033641,-0.1276250&mode=transit
      getDirectionOptions(startLat, startLong, endLat, endLong, callback) {
        request.get("http://ec2-35-182-16-224.ca-central-1.compute.amazonaws.com/api/getCombinedData?lat=" + startLat + "&lon=" + startLong + "&dest_lat=" + endLat + "&dest_lon=" + endLong).end(callback);
    };

      getDirections(startLat, startLong, endLat, endLong){
          this.getDirectionOptions(startLat, startLong, endLat, endLong, (err, result) => {
              var data = JSON.parse(result.text)
              if (data){
                  this.state.methods = data;
                  console.log(this.state.methods)
              }
          });
          var min = this.state.methods[0]
          for(var i = 1; i < this.state.methods.length;  i++){
              if (this.state.methods[i].lyft_data.display_name == "The requested location is not inside a Lyft service area"){
                  this.state.methods.pop(i)
                  continue;
              }
              if ((this.state.methods[i].lyft_data.cost_max + this.state.methods[i].lyft_data.cost_min) / 2 < min){
                  min = this.state.methods[i]
              }
          }
          this.state.best_method = min
      };
  search(e, destination, lat, long){
        this.getData(destination, lat, long);
  };
  select(item){
      this.updateDestination(item.address);
      this.state.dest.lat = item.coords.lat;
      this.state.dest.long = item.coords.lng;
      this.state.dest.name = item.name;
      this.getDirections(this.state.location.coords.latitude, this.state.location.coords.longitude, this.state.dest.lat ,this.state.dest.long)
      this.setModalVisible(true);
  }

    locationChanged = (location) => {
        region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            this.setState({
                location,
                region
            })
    }
    render() {
        if (this.state.suggestions){
            return (
                <View style={styles.container}>
                <MapView style = {styles.map}
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    showsUserLocation = {true}>
                      <MapView.Marker
                        coordinate={{
                            latitude: this.state.dest.lat,
                            longitude: this.state.dest.long,
                        }}
                        title={this.state.dest.name}
                        description={this.state.dest.name}
                      />
                </MapView>
                <View style={styles.top}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TextInput
                      style={{height: 40, backgroundColor: '#fff', padding: 5}}
                      placeholder="Where are you headed?"
                      onChangeText={(text) => this.updateDestination(text)}
                      value={this.state.destination}
                    />
                    <View >
                    <FlatList
                      data={this.state.suggestions}
                      renderItem={({item}) => <Text style={styles.item} onPress={(text) => this.select(item)}>{ item.address }</Text>}
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
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {alert("Modal has been closed.")}}
                  >
                 <View style={{marginTop: 22}}>
                  <View>
                    <Text style={styles.title}>Best Route</Text>
                    <Text>
                    {JSON.stringify(this.state.best_method)}
                        Walking Time: {this.state.best_method}
                    </Text>
                    <Button
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible)
                    }}
                      title="Hide"
                      color="#841584"
                      text="Hide"
                      />
                  </View>
                 </View>
                </Modal>
</View>

            );
        } else{
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
                  placeholder="Where are you headed?"
                  onChangeText={(text) => this.updateDestination(text)}
                  value={this.state.destination}
                />
            </View>
            </View>
        }
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
        padding: 10,
        textAlign: 'center',
        fontSize: 25
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
    },

  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
