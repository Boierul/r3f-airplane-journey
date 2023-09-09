import {useMemo, useRef} from "react";

import {Float, PerspectiveCamera, useScroll} from "@react-three/drei";
import * as THREE from "three";

import {Background} from "./Background.jsx";
import {Airplane} from "./Airplane.jsx";
import {Cloud} from "./Cloud.jsx";
import {useFrame} from "@react-three/fiber";

const LINE_NR_POINTS = 24000;

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
                new THREE.Vector3(0, 0, -10),
                new THREE.Vector3(-2, 0, -20),
                new THREE.Vector3(-3, 0, -30),
                new THREE.Vector3(0, 0, -40),
                new THREE.Vector3(5, 0, -50),
                new THREE.Vector3(7, 0, -60),
                new THREE.Vector3(5, 0, -70),
                new THREE.Vector3(0, 0, -80),
                new THREE.Vector3(0, 0, -90),
                new THREE.Vector3(0, 0, -100),
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
        shape.moveTo(0, -0.2);
        shape.lineTo(0, 0.2);

        return shape;
    }, [curve]);

    // Will be called every frame to set up the logic
    useFrame((_state, delta) => {
        // Get the current point of the scrolling
        const currentPointIndex = Math.min(
            Math.round(scroll.offset * linePoints.length),
            linePoints.length - 1
        );
        // Sets point of the scrolling
        const currentPoint = linePoints[currentPointIndex];
        // Rotate the plane and camera based on the position of the curve
        const pointAhead =
            linePoints[Math.min(currentPointIndex + 1, linePoints.length - 1)];

        // Calculate the displacement of the plane based on the curve
        const xDisplacement = (pointAhead.x - currentPoint.x) * 80;
        // Math.PI / 2 -> LEFT
        // -Math.PI / 2 -> RIGHT

        // Calculate the angle of the plane based on the displacement
        const angleRotation =
            (xDisplacement < 0 ? 1 : -1) *
            Math.min(Math.abs(xDisplacement), Math.PI / 3);

        // Set the airplane rotation
        const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                airplane.current.rotation.x,
                airplane.current.rotation.y,
                angleRotation
            )
        );
        // Smoothly rotate the plane while following the line
        airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);

        // Set the camera rotation
        const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                cameraGroup.current.rotation.x,
                angleRotation,
                cameraGroup.current.rotation.z
            )
        );
        // Smoothly rotate the camera while following the line
        cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta * 2);

        // Makes the camera follow the line
        cameraGroup.current.position.lerp(currentPoint, delta * 24);
    });

    return (
        <>
            {/*<OrbitControls enableZoom={false}/>*/}
            <group ref={cameraGroup}>
                <Background/>
                <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault/>
                <group ref={airplane}>
                    <Float floatIntensity={2} speed={2}>
                        <Airplane rotation-y={Math.PI / 2} scale={[0.2, 0.2, 0.2]} position-y={0.1}/>
                    </Float>
                </group>
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
                                extrudePath: curve,
                            },
                        ]}
                    />
                    <meshStandardMaterial color={"white"} opacity={0.7} transparent/>
                </mesh>
            </group>

            {/* Clouds objects */}
            <Cloud
                opacity={0.5}
                scale={[0.3, 0.3, 0.3]}
                position={[-2, 1, -3]}/>
            <Cloud
                opacity={0.5}
                scale={[0.2, 0.3, 0.4]}
                position={[1.5, -0.5, -2]}/>
            <Cloud
                opacity={0.7}
                scale={[0.3, 0.3, 0.4]}
                rotation-y={Math.PI / 9}
                position={[2, -0.2, -2]}
            />
            <Cloud
                opacity={0.7}
                scale={[0.4, 0.4, 0.4]}
                rotation-y={Math.PI / 9}
                position={[1, -0.2, -12]}
            />
            <Cloud
                opacity={0.7}
                scale={[0.5, 0.5, 0.5]}
                position={[-1, 1, -53]}/>
            <Cloud
                opacity={0.3}
                scale={[0.8, 0.8, 0.8]}
                position={[0, 1, -100]}/>
        </>
    );
};
