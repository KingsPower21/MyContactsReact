import React from "react";
import {View, TouchableOpacity, StyleSheet, Text} from "react-native";
import {Camera} from "expo-camera";
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import * as Permissions from 'expo-permissions';

const DefaultCameraType = Camera.Constants.Type.back;
export default class CameraScreen extends React.Component {
    camera;

    static navigationOptions = {
        title: 'Profile Photo',
    };

    constructor(props) {
        super(props);
        const { onPhoto} = this.props.navigation.state.params;
        this.camera = null;
        this.state = {
            type: DefaultCameraType,
            hasCameraPermission: null,
            cameraStatus: 'Access not granted',
            callback: onPhoto,
        };
    }

    componentDidMount() {
        Permissions.askAsync(Permissions.CAMERA).then((response) => {
            if(response.granted) {
                this.setState( {
                    hasCameraPermission: true,
                    cameraStatus: response.granted,
                });
                return;
            }

            this.setState({
                hasCameraPermission: false,
                cameraStatus: 'Access denied to camera'
            })
        }).catch((error) => {
            this.setState({
                hasCameraPermission: false,
                cameraStatus: 'Access denied to camera. Error: ' + error,
            })
        });
    }

    handleCameraType(){
        const type = this.state.type || Camera.Constants.Type.back;
        this.setState( {
            type: (type === Camera.Constants.Type.back)
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
        });
    }
    handlePhoto() {
        if (this.camera) {
            const options = {
              base64: true,
              quality: 0.5,
            };
            this.camera.takePictureAsync(options).then((photo) => {
                const photoBase64 = 'data:image/jpg;base64,' + photo.base64;
                this.state.callback(photoBase64);
                this.props.navigation.goBack();
            }).catch((error) => {
               console.log('An error occurred using the camera. Error: ' + error);
            });
        }
    }

    render() {
        const type = this.state.type || DefaultCameraType;
        const hasCameraPermission = this.state.hasCameraPermission;
        if (! hasCameraPermission){
            return (
                <View style={styles.container}>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>
                        Camera Not Available
                    </Text>
                    <Text> {this.state.cameraStatus}</Text>
                </View>
            );
        }
        return (
            <View style={{flex: 1}}>
                <Camera style={{flex:1}} type={type}
                        ref={camera => this.camera = camera}>
                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.control}>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.aperture}
                                            onPress={this.handlePhoto.bind(this)}>
                            <Ionicons size={72} color={Colors.tintColor}
                                     name={((Platform.OS === 'ios') ? 'ios-aperture' : 'md-aperture')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.control}
                                            onPress={this.handleCameraType.bind(this)}>
                            <Ionicons size={32} color={'#fff'}
                                      name={((Platform.OS === 'ios') ? 'ios-reverse-camera' : 'md-reverse-camera')}/>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
   },
    controls: {
       flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginBottom: 10,
    },
    aperture: {
       flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        alignContent: 'center',
    },
    control: {
       flex: 0.1,
       alignSelf: 'flex-end',
       alignItems: 'center',
    },
});
