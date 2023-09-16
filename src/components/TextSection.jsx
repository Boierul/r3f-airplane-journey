import {Text} from "@react-three/drei";
import React from "react";
import {fadeOnBeforeCompileFlat} from "../utils/fadeMaterial.js";

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
                    <meshStandardMaterial
                        color={"white"}
                        onBeforeCompile={fadeOnBeforeCompileFlat}
                    />
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
                <meshStandardMaterial
                    color={"white"}
                    onBeforeCompile={fadeOnBeforeCompileFlat}
                />
            </Text>
        </group>
    )
}