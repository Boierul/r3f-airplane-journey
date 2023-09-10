import React, {useMemo, useRef} from "react";

import {Float, PerspectiveCamera, Text, useScroll} from "@react-three/drei";
import * as THREE from "three";
import {Group} from "three";

import {Background} from "./Background.jsx";
import {Airplane} from "./Airplane.jsx";
import {useFrame} from "@react-three/fiber";
import {Cloud_v2} from "./Cloud_v2.jsx";

const LINE_NR_POINTS = 1000;
const CURVE_DISTANCE = 250;

// Simulates the ahead position of the camera
const CURVE_AHEAD_CAMERA = 0.008;
// Simulates the ahead position of the airplane
const CURVE_AHEAD_AIRPLANE = 0.02;
// Limits the angle the airplane can go
const AIRPLANE_MAX_ANGLE = 35;

export const Experience = () => {
    // Camera group of the plane
    const cameraGroup = useRef();
    // Airplane group
    const airplane = useRef();
    // Scroll hook used to get the scroll offset
    const scroll = useScroll();

    // Curve line for the airplane
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(
            [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, -CURVE_DISTANCE),
                new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
                new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
                new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
                new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
                new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
                new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
            ],
            false,
            "catmullrom",
            0.5
        );
    }, []);

    // Points for the curve line
    const linePoints = useMemo(() => {
        return curve.getPoints(LINE_NR_POINTS);
    }, [curve]);

    // Will be used to make the shape of the line
    const shape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, -0.08);
        shape.lineTo(0, 0.08);

        return shape;
    }, [curve]);

    // Will be called every frame to set up the logic
    useFrame((_state, delta) => {
        // Get the current point of the scrolling
        const scrollOffset = Math.max(0, scroll.offset);

        // Sets point of the scrolling
        const currentPoint = curve.getPoint(scrollOffset);

        // Makes the camera follow the curve points
        cameraGroup.current.position.lerp(currentPoint, delta * 24);


        /* Makes the group look ahead on the curve (better animation) */

        // Look at the current point of the camera and the airplane
        const lookAtPoint = curve.getPoint(
            Math.min(scrollOffset + CURVE_AHEAD_CAMERA, 1)
        );

        // Show the current position of the camera
        const currentLookAt = cameraGroup.current.getWorldDirection(
            new THREE.Vector3()
        );

        // Target look at direction
        const targetLookAt = new THREE.Vector3()
            .subVectors(currentPoint, lookAtPoint)
            .normalize();

        // Interpolate the look and the target
        const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
        cameraGroup.current.lookAt(
            cameraGroup.current.position.clone().add(lookAt)
        );

        /* Airplane rotation */
        const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_AIRPLANE);

        // Avoid extra rotation caused by the smooth effect on the camera
        const nonLerpLookAt = new Group();
        nonLerpLookAt.position.copy(currentPoint);
        nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

        // Apply inverse of the lookAtRotation to calculate the correct angle while following
        // the curve (despite the direction of it)
        tangent.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            -nonLerpLookAt.rotation.y
        );

        // Get the angle of the rotation
        let angle = Math.atan2(-tangent.z, tangent.x);
        // Fixes the angle
        angle = -Math.PI / 2 + angle;

        // Will make the airplane moving effect more evident
        let angleDegrees = (angle * 180) / Math.PI;
        angleDegrees *= 2.4; // stronger angle

        // Limit airplane angle
        if (angleDegrees < 0) {
            angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
        }
        if (angleDegrees > 0) {
            angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
        }

        // Set the angle back
        angle = (angleDegrees * Math.PI) / 180;

        // Rotate the plane smoothly
        const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                airplane.current.rotation.x,
                airplane.current.rotation.y,
                angle
            )
        );
        airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
    });

    return (
        <>
            <directionalLight position={[0, 3, 1]} intensity={0.1}/>
            {/*<OrbitControls/>*/}
            <group ref={cameraGroup}>
                <Background/>
                <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault/>
                <group ref={airplane}>
                    <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
                        <Airplane rotation-y={Math.PI / 2} scale={[0.2, 0.2, 0.2]} position-y={0.1}/>
                    </Float>
                </group>
            </group>

            {/* Text objects */}
            <group position={[-4, 0.75, -60]}>
                <Text
                    color="white"
                    anchorX={"left"}
                    anchorY="middle"
                    fontSize={0.19}
                    maxWidth={2.5}
                    font={"./fonts/Roslindale-Display-Bold.ttf"}
                >
                    Fly with Airplane Journey!
                </Text>
                <Text
                    color="white"
                    anchorX={"left"}
                    anchorY="middle"
                    fontSize={0.155}
                    maxWidth={2.5}
                    position-y={-0.22}
                    font={"./fonts/Bahnschrift.ttf"}
                >
                    Have a seat, relax and enjoy the ride
                </Text>
            </group>

            <group position={[-8.5, 2, -180]}>
                <Text
                    color="white"
                    anchorX={"left"}
                    anchorY="center"
                    fontSize={0.19}
                    maxWidth={2.5}
                    font={"./fonts/Roslindale-Display-Bold.ttf"}
                >
                    Services
                </Text>
                <Text
                    color="white"
                    anchorX={"left"}
                    anchorY="top"
                    position-y={-0.22}
                    fontSize={0.155}
                    maxWidth={2.5}
                    font={"./fonts/Bahnschrift.ttf"}
                >
                    Do you want a drink?{"\n"}
                    We have a wide range of beverages!
                </Text>
            </group>

            {/* Line object */}
            {/* The extrudeGeometry will make the plane follow the line */}
            <group position-y={-2}>
                <mesh>
                    <extrudeGeometry
                        args={[
                            shape,
                            {
                                steps: LINE_NR_POINTS,
                                bevelEnabled: false,
                                extrudePath: curve
                            },
                        ]}
                    />
                    <meshStandardMaterial
                        color={"white"}
                        opacity={1}
                        transparent
                        envMapIntensity={2}
                    />
                </mesh>
            </group>

            {/* Clouds objects */}
            <Cloud_v2
                scale={[1, 1, 1.5]}
                position={[-3.5, -1.2, -7]}
            />
            <Cloud_v2
                scale={[1, 1, 2]}
                position={[3.5, -.5, -12]}
                rotation-y={Math.PI}
            />
            <Cloud_v2
                scale={[3.2, 2, 1.5]}
                position={[-3.5, 5, -45]}
                rotation-y={Math.PI / 3}
            />
            <Cloud_v2
                scale={[5, 5, 5]}
                position={[3.5, -20.2, -52]}
            />
            <Cloud_v2
                scale={[8, 8, 10]}
                rotation-y={Math.PI / 9}
                position={[24, 14.2, -200]}
            />
            <Cloud_v2
                scale={[4, 4, 3]}
                position={[-18, -8.5, -213]}
            />
            <Cloud_v2
                scale={[0.8, 0.8, 0.8]}
                position={[-1, -1.5, -192]}
            />
        </>
    );
};
