import Colors from "../constants/Colors";
import {Text, View} from "react-native";
import React from "react";

function TextAvatar({user, size}) {
    const container = {
        width: size,
        height: size,
        backgroundColor: Colors.tintColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: size / 2
    };
    const text = {
        color: Colors.noticeText,
        fontSize: size / 3.14,
        fontWeight: 'bold',
        letterSpacing: 1,
    };
    const initials = user.firstName.substring(0, 1).toUpperCase() +
        user.lastName.substring(0, 1).toUpperCase();

    return (
        <View style={container}>
            <Text style={text} adjustsFontSizeToFit={true}>
                {initials}
            </Text>
        </View>
    );
}
