import {Image} from "react-native";
import React from "react";

export function Avatar({user, size = 50, backgroundColor, style }) {
    const defaultStyle = {
        width: size,
        height: size,
        borderRadius: size /2,
        backgroundColor
    };
    return (
        <Image style={ [defaultStyle, style] } source={{uri: user.photo}} />
    );
}
