import {Text, View} from "react-native";
import {Avatar} from "./Avatar";
import React from "react";
import Colors from "../constants/Colors";

export function UserListItem({user, size = 60, location, displayLocation = false }) {
    const container = {
        flexDirection: 'row',
        paddingTop: 4,
        paddingBottom: 4,
    };
    const text = {
        flex: 1,
        paddingLeft: 4,
        textAlignVertical: 'center',
    };
    const distanceStyle = {
        textAlignVertical: 'center',
        color: Colors.tabIconDefault,
    };

    const distanceView = ((displayLocation) && (location))
        ? <Text style={distanceStyle}>
            {user.address.distanceFrom(location.latitude, location.longitude).toFixed(2) + ' miles'}
    </Text>
        :null;
    return(
        <View style={container}>
            <Avatar user={user} size={size} />
            <Text style={text}>{user.name}</Text>
            {distanceView}
        </View>
    );
}
