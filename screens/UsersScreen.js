import React from 'react';
import {FlatList, Image, StyleSheet, Text, View, TouchableHighlight, Picker} from 'react-native';
import {UserService} from "../shared/modules/UserService";
import {Avatar} from "../components/Avatar";
import {UserListItem} from "../components/UserListItem";
import Colors from "../constants/Colors";
import ProfileService from "../shared/modules/ProfileService";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

const DefaultRange = 0;
function RangerPicker(props) {
  const {range, style, onValueChange} = props;
  return(
    <Picker style={[styles.input, style]} selectedValue={range || DefaultRange }
            onValueChange={onValueChange}>
      <Picker.Item label="No Limit" value={0}/>
      <Picker.Item label="100 Miles" value={100}/>
      <Picker.Item label="200 Miles" value={200}/>
      <Picker.Item label="500 Miles" value={500}/>
      <Picker.Item label="1000 Miles" value={1000}/>
    </Picker>
  );
}
const MaximumContactLimit = 2500;
export default class UsersScreen extends React.Component {
  static navigationOptions = {
    title: 'Users',
  };
  #userService;
  #profileService;

  constructor(props) {
    super(props);
    this.#userService = new UserService();
    this.#profileService = new ProfileService();
    this.state = {
      users: props.users || [],
      error: null,
      isRefreshing: false,
      range: DefaultRange,
      hasLocationPermission: null,
    }
  }
  componentDidMount() {
    Permissions.askAsync(Permissions.LOCATION).then((response) => {
      this.setState({
        hasLocationPermission: response.granted,
      });
    }).finally(() => {
      this.#profileService.get().then((settings) => {
        this.setState( {
          limit: settings.contactLimit,
        });
        this.refresh();
      });
    });
  }

  filterUsersByRange(users) {
    const {range, location} = this.state;
    if((range) && (location)) {
      const {latitude, longitude} = location;
      let count = 0;
      return(users.filter((user, index) => {
        if(count < this.state.limit) {
          const isInRange = (user.address.distanceFrom(latitude, longitude) <= range);
          if(isInRange) {
            count++;
          }
          return(isInRange);
        }
        return (false);
      }));
    }
    return (users);
  }
  refresh() {
    const locationOptions = {enableHighAccuracy: true};
    Location.getCurrentPositionAsync(locationOptions).then((location) =>{
      this.setState( {
        location: location.coords,
      })
    }).finally(() => {
      let limit = this.state.limit;
      const {location, range} = this.state;
      if ((location) && (range)) {
        limit = MaximumContactLimit;
      }
      this.#userService.all(limit).then((users) => {
        this.setState({
          users: users,
          error: null,
          isRefreshing: false,
        })
      }).catch((err) => {
        this.setState({
          users: [],
          isRefreshing: false,
          error
        })
      });
    });

  }

  handlePress(user) {
    const {navigate} = this.props.navigation;
    navigate ('User', {user: user});
  }

  handleRange(value) {
    this.setState( {
      range: value,
    });
    this.refresh();
  }

  render() {
    const {location, range} = this.state;
    const users = this.filterUsersByRange(this.state.users || []);
    return (
        <View style={styles.container}>
          <RangerPicker range={range} onValueChange={this.handleRange.bind(this)}/>
          <FlatList
                    data={ users }
                    renderItem={({ item, index, separators }) => {
                      return (
                          <TouchableHighlight
                              key={item.id}
                              onPress={() => this.handlePress(item)}
                              underlayColor={ Colors.highlight }
                              onShowUnderlay={ separators.highlight}
                              onHideUnderlay={ separators.unhighlight }
                          >
                            <UserListItem user={item} displayLocation={((range) && (location))}
                                          location={location} />
                          </TouchableHighlight>
                      );
                    }}
                    ListEmptyComponent={ <Text> No users </Text> }
                    ItemSeparatorComponent={() => <View style={ styles.line } /> }
                    refreshing={this.state.isRefreshing}
                    onRefresh={ () => this.refresh() }
          >
          </FlatList>
        </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  line: {
    height: 0.5,
    width: '100%',
    backgroundColor: "rgba(200,200,200,0.5)"
  },
  input: {
    color: Colors.tintColor,
  }
});
