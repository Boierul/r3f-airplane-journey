import {Text} from "@react-three/drei";
import React from "react";

export const TextSection = ({title, subtitle, ...props}) => {
    return (
        <group {...props}>
            {!!title && (
                <Text
                    color="white"
                    anchorX={"left"}
                    anchorY="center"
                    fontSize={0.2}
                    maxWidth={3.5}
                    font={"./fonts/Roslindale-Display-Bold.ttf"}
                >
                    {title}
                </Text>
            )}
            <Text
                color="white"
                anchorX={"left"}
                anchorY="top"
                position-y={-0.22}
                fontSize={0.155}
                maxWidth={3.5}
                font={"./fonts/Bahnschrift.ttf"}
            >
                {subtitle}
            </Text>
        </group>
    )
}