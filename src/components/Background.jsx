import {Environment, Sphere} from "@react-three/drei";
import {Gradient, LayerMaterial} from "lamina";

import * as THREE from "three";

// <LayerMaterial change BackSide to Backside
export const Background = () => {
    return <>
        {/*<Environment preset="sunset"/>*/}
        <Sphere scale={[100, 100, 100]} rotationY={Math.PI / 2}>
        <LayerMaterial
                lighting='physical'
                transmission={1}
                side={THREE.BackSide}
            >
                <Gradient colorA={"blue"} colorB={"red"}/>
            </LayerMaterial>
        </Sphere>
    </>
}