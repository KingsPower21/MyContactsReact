import React from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet, TextInput, Picker, Button, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Colors from "../constants/Colors";
import ProfileService from "../shared/modules/ProfileService";
import {Settings} from "../shared/Settings";
import TouchableOpacity from "react-native-web/src/exports/TouchableOpacity";



function SectionView(props) {
  const defaultStyle = StyleSheet.create({
    container: {
      paddingTop: 30,
    },
    header: {
      fontWeight: 'bold',
    },
  });
  const {title, style} = props;
  return (
      <View style={[defaultStyle.container, style]}>
        <Text style={defaultStyle.header}>{title}</Text>
        {props.children}
      </View>
  );
}

function InputView(props) {
  const defaultStyle = StyleSheet.create({
    container: {
      paddingTop: 9,
      alignSelf: 'stretch',
    },
    label: {
      fontSize: 10,
    },
    required: {
      color: Colors.warningText,
    },
    hint: {
      color: Colors.tabIconDefault,
      fontSize: 10,
    }

  });

  const {label, control, isRequired, style, hint} = props;
  const requiredView = (isRequired) ? <Text style={ defaultStyle.required}>*</Text> : null;
  const hintView = (hint) ? <Text style={defaultStyle.hint}>{hint}</Text> : null;
  return(
      <View style={[defaultStyle, style]}>
        <Text style={defaultStyle.label}>{label} {requiredView}</Text>
        {control}
        {props.children}
        {hintView}
      </View>
  );
}

function ContactLimitPicker(props) {
  const {limit, style, onValueChange} = props;
  return(
      <Picker style={[styles.input, style]} selectedValue={limit}
        onValueChange={onValueChange}>
        <Picker.Item label="10" value={10}/>
        <Picker.Item label="50" value={50}/>
        <Picker.Item label="100" value={100}/>
        <Picker.Item label="250" value={250}/>
        <Picker.Item label="500" value={500}/>
        <Picker.Item label="1000" value={1000}/>
      </Picker>
  );
}
export default class SettingsScreen extends React.Component {
  #profileService;

  constructor(props) {
    super(props);

    this.#profileService = new ProfileService();
    this.state = Object.assign( {isChanged: false}, new Settings());
  }

  componentDidMount() {
    this.#profileService.get().then((settings) => {
      this.setState(settings);
    }).catch((error) => {
      console.log('Failed to retrieve profile settings for Setting display. Error: ' + error);
    });
  }

  handleSave() {

    const settings = new Settings( {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contactLimit: this.state.contactLimit,
      photo: this.state.photo,
    });
    console.log('SettingsScreen.handleSave()=' + JSON.stringify(settings));
    this.#profileService.save(settings).then(() => {
      this.setState( {
        isChanged: false,
      });
    }).catch((error) => {
      console.log('Failed to save profile settings for Settings display. Error: ' + error);
    });
  }

  handlePhotoChange() {
    const {navigate} = this.props.navigation;
    navigate('Camera', {
      onPhoto: (photo) => {
        this.setState( {
          photo: photo,
          isChanged: true,
        })
      }
    });
  }
  render() {
    const size = this.props.size || 110;
    const iconContainer = {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: 'white',
      borderColor: Colors.tintColor,
      borderWidth: 3,
      overflow: 'hidden',
    };


    const settings = this.state;
    const name = (settings.lastName || '') +
        ((settings.lastName) && (settings.firstName) ? ', ' : '') +
        (settings.firstName || '');
    const photoView = (settings.photo)
        ? <Image source={{width: size, height: size, uri: settings.photo}}/>
        : <Ionicons size={size * 0.65} color={Colors.tabIconDefault}
                    name={(Platform.OS === 'ios' ? 'ios-camera' : 'md-camera')}/>
        return (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={[styles.headerContent, iconContainer]}>
              <TouchableWithoutFeedback onPress={this.handlePhotoChange.bind(this)}>
                {photoView}
              </TouchableWithoutFeedback>
            </View>
            <Text style={styles.headerText}>{name}</Text>
          </View>
          <View style={styles.content}>
            <SectionView title="Name">
              <InputView label="Last Name" isRequired={true}>
                <TextInput style={[styles.input, styles.inputUnderline]}
                           value={settings.lastName}
                            onChangeText={ (text) => this.setState( {
                              lastName: text, isChanged: true,
                            })}/>
              </InputView>
              <InputView label="First Name" isRequired={true}>
                <TextInput style={[styles.input, styles.inputUnderline]}
                           value={settings.firstName}
                            onChangeText={(text) => this.setState( {
                              firstName: text, isChanged: true,
                            })}/>
              </InputView>
            </SectionView>

            <SectionView title="Preferences">
              <InputView label="Contact Limit" hint="Controls number of contacts displayed.">
                <ContactLimitPicker limit={settings.contactLimit}
                                    onValueChange={(value) => this.setState({
                                    contactLimit: value, isChanged: true,
                })}/>
              </InputView>
            </SectionView>

            <View style={styles.actionContainer}>
              <Button color={Colors.errorBackground} title="Save" disabled={(! settings.isChanged)}
                      onPress={ this.handleSave.bind(this)}/>
            </View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    height: 100,
    alignItems: 'stretch',
    backgroundColor: Colors.tintColor,
  },
  headerContent: {
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerText: {
    top: 30,
    fontWeight: 'bold',
    fontSize: 24,
    alignSelf: 'center',
  },
  content: {
    top: 80,
    padding: 8,
  },
  input: {
    color: Colors.tintColor,
  },
  inputUnderline: {
    borderColor: Colors.tabIconDefault,
    borderBottomWidth: 1,
  },
  hint: {
    color: Colors.tabIconDefault,
    fontSize: 10,
  },
  actionContainer: {
    paddingTop: 30,
  },
});
SettingsScreen.navigationOptions = {
  title: 'Settings',
};
