import React from 'react';
import { StyleSheet, Text, View, Button, Platform, Alert,
    TouchableWithoutFeedback } from 'react-native';
import Colors from '../constants/Colors';
import {Avatar} from "../components/Avatar";
import {Ionicons} from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';


function AddressCard(props) {
    const {address, location} = props;
    const margin = 10;
    const padding = 10;
    const styles = StyleSheet.create({
        container: {
            margin: margin,
            marginBottom: 20,
            padding: padding,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.8,
            elevation: 5,
            backgroundColor: '#fff',
            flexDirection: 'column',
            alignItems: 'stretch',
        },
        header:{
            fontSize: 16,
            fontWeight: 'bold',
        },
        subheader:{
            fontSize: 12,
        },
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 4,
            paddingBottom: 4,
        },
        itemText: {
            flex: 1,
            marginLeft: 20,
        },
        distance: {
            alignSelf: 'center',
            justifyContent: 'center',
            color: Colors.tabIconDefault,
        }
    });

    const locationView = (location)
    ?   <Text style={[styles.item, styles.item, styles.distance]}>
            ~{address.distanceFrom(location.latitude, location.longitude)
            .toFixed(2)} miles away from current location.
        </Text>
        : null;
    return(
        <View style={ styles.container}>
            <Text style={styles.header}>Address</Text>
            <Text style={styles.subheader}>Home</Text>
            <View style={styles.item}>
                <Ionicons color={Colors.tabIconDefault} size={24}
                          name={((Platform.OS === 'ios') ? 'ios-home' : 'md-home')}/>
                <Text style={styles.itemText}>{address.street + '\n' +
                       address.city + ', ' + address.state + ' ' + address.zipcode}</Text>
            </View>
            <View style={styles.item}>
                <Ionicons color={Colors.tabIconDefault} size={24}
                          name={((Platform.OS === 'ios') ? 'ios-pin' : 'md-pin')}/>
                <Text style={styles.itemText}> {address.latitude + ', ' + address.longitude}</Text>
                <TouchableWithoutFeedback
                                          onPress={() => Alert.alert('[To Do] Display Map',
                    'Display the map for lat: ' + address.latitude
                    + ', long: ' + address.longitude )}>
                    <Text style={ { color: Colors.tintColor }}>View</Text>
                </TouchableWithoutFeedback>
            </View>
            {locationView}
        </View>
    );
}



export default class UserScreen extends React.Component {
    constructor(props) {
        super(props);
        const {user} = this.props.navigation.state.params;
        if (! user) {
            console.log('No user provided for navigation. Returning to users list.');
            this.props.navigation.goBack();
            return;

        }
        this.props.navigation.setParams({ screenTitle: user.name });
        this.state = {
            user: user,
        }
    }

    componentDidMount() {
        Permissions.askAsync(Permissions.LOCATION).then((response) => {
            if (response.granted) {
                const locationOptions = {enableHighAccuracy: true};
                Location.getCurrentPositionAsync(locationOptions).then((location) => {
                    console.log(location);
                    this.setState( {
                        location: location.coords,
                    })
                })
            }
        })
    }

    render() {
        const user = this.state.user;
        const location = this.state.location;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Avatar style={{borderColor: Colors.tintColor, borderWidth: 3}} user={user} size={110}/>
                    </View>
                </View>
                <View style={styles.holder}>
                    <View style={styles.nameContainer}>
                        <Text style={{fontSize: 24, fontWeight: 'bold'}}>{user.name}</Text>
                        <Text style={{fontSize: 14}}>{user.address.country}</Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <AddressCard address={user.address} location={location}/>
                    </View>
                </View>
            </View>
        );
    }
}

UserScreen.navigationOptions =  ({ navigation }) => {
    const {params} = navigation.state;
    return ({
        title: (params) ? params.screenTitle : 'User Detail'

    })
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    holder: {
        flex: 1,
    },
    nameContainer: {
        flex: 2,
        top: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContainer: {
        flex: 9, top: 40,
    },

        header: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        height: 100,
        alignItems: 'stretch',
        backgroundColor: Colors.tintColor,
    },

    avatarContainer: {
        position: 'absolute',
        top: 60, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
});


