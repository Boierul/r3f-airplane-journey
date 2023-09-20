import React, {useEffect, useLayoutEffect, useMemo, useRef} from "react";

import {Float, PerspectiveCamera, useScroll} from "@react-three/drei";

import * as THREE from "three";
import {Euler, Group, Vector3} from "three";

import {gsap} from "gsap";

import {Background} from "./Background.jsx";
import {Airplane} from "./Airplane.jsx";
import {useFrame} from "@react-three/fiber";
import {Cloud_v2} from "./Cloud_v2.jsx";
import {TextSection} from "./TextSection.jsx";
import {fadeOnBeforeCompile} from "../utils/fadeMaterial.js";
import {usePlay} from "../context/Play.jsx";

const LINE_NR_POINTS = 1000;
const CURVE_DISTANCE = 250;

// Simulates the ahead position of the camera
const CURVE_AHEAD_CAMERA = 0.008;
// Simulates the ahead position of the airplane
const CURVE_AHEAD_AIRPLANE = 0.02;
// Limits the angle the airplane can go
const AIRPLANE_MAX_ANGLE = 35;
// Used in the camera rail to make the camera slow down when approaching a text section
const FRICTION_DISTANCE = 42;

export const Experience = () => {
    // Camera group of the plane
    const cameraGroup = useRef();
    //Camera group that will make the plane slow down when approaching a text section
    const cameraRail = useRef();
    // Airplane group
    const airplane = useRef();
    // Scroll hook used to get the scroll offset
    const scroll = useScroll();
    // Last scroll offset (position of the scroll on the last frame)
    const lastScroll = useRef(0);

    // Variable with all the curve points
    const curvePoints = useMemo(
        () => [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -CURVE_DISTANCE),
            new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
            new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
            new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
            new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
            new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
            new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
        ],
        []
    );

    // Variable with the opacity of the scene
    const sceneOpacity = useRef(0);
    const lineMaterialRef = useRef();

    // Curve line for the airplane
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(
            curvePoints,
            false,
            "catmullrom",
            0.5
        );
    }, []);

    // Will be used to make the shape of the line
    const shape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, -0.08);
        shape.lineTo(0, 0.08);

        return shape;
    }, [curve]);

    // Create text sections with useMemo to not re-instantiate them on re-render
    const textSections = useMemo(() => {
        return [
            {
                cameraRailDist: -1,
                position: new Vector3(
                    curvePoints[1].x - 3,
                    curvePoints[1].y,
                    curvePoints[1].z
                ),
                title: `Fly with Airplane Journey!`,
                subtitle: `Have a seat, relax and enjoy the ride`,
            },
            {
                cameraRailDist: 1.5,
                position: new Vector3(
                    curvePoints[2].x + 2,
                    curvePoints[2].y,
                    curvePoints[2].z
                ),
                title: "Elevate your web experience",
                subtitle: `Embark on a seamless journey as you 
navigate through the sky by simply scrolling`,
            },
            {
                cameraRailDist: -1,
                position: new Vector3(
                    curvePoints[3].x - 3,
                    curvePoints[3].y,
                    curvePoints[3].z
                ),
                title: "Feel like a pilot",
                subtitle: `Gain a deeper understanding of web aviation 
as you explore the content of this journey`,
            },
            {
                cameraRailDist: 1.5,
                position: new Vector3(
                    curvePoints[4].x + 3.5,
                    curvePoints[4].y,
                    curvePoints[4].z - 12
                ),
                title: "Responsive Design",
                subtitle: `Whether you're on a desktop, tablet, or smartphone, our website adapts to your device, ensuring a consistent and enjoyable experience`,
            },
            {
                cameraRailDist: -1,
                position: new Vector3(
                    curvePoints[5].x - 5.5,
                    curvePoints[5].y,
                    curvePoints[5].z - 10
                ),
                title: "Skybound Odyssey",
                subtitle: `Where every scroll takes you higher`,
            },
        ]
            ;
    }, []);

    // Create clouds with useMemo to not re-instantiate them on re-render
    const clouds = useMemo(() => [
        // STARTING
        {
            position: new Vector3(-3.5, -3.2, -6),
        },
        {
            position: new Vector3(3.5, -4, -10),
            scale: new Vector3(1.5, 1.5, 1.5),
        },
        {
            scale: new Vector3(7, 7, 7),
            position: new Vector3(-20, 0.2, -68),
            rotation: new Euler(-Math.PI / 5, Math.PI / 6, 0),
        },
        {
            scale: new Vector3(2.5, 2.5, 2.5),
            position: new Vector3(10, -1.2, -52),
        },
        // FIRST POINT
        {
            scale: new Vector3(4, 4, 4),
            position: new Vector3(
                curvePoints[1].x + 10,
                curvePoints[1].y - 4,
                curvePoints[1].z + 64
            ),
        },
        {
            scale: new Vector3(3, 3, 3),
            position: new Vector3(
                curvePoints[1].x - 20,
                curvePoints[1].y + 4,
                curvePoints[1].z + 28
            ),
            rotation: new Euler(0, Math.PI / 7, 0),
        },
        {
            rotation: new Euler(0, Math.PI / 7, Math.PI / 5),
            scale: new Vector3(5, 5, 5),
            position: new Vector3(
                curvePoints[1].x - 13,
                curvePoints[1].y + 4,
                curvePoints[1].z - 62
            ),
        },
        {
            rotation: new Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
            scale: new Vector3(5, 5, 5),
            position: new Vector3(
                curvePoints[1].x + 54,
                curvePoints[1].y + 2,
                curvePoints[1].z - 82
            ),
        },
        {
            scale: new Vector3(5, 5, 5),
            position: new Vector3(
                curvePoints[1].x + 8,
                curvePoints[1].y - 14,
                curvePoints[1].z - 22
            ),
        },
        // SECOND POINT
        {
            scale: new Vector3(3, 3, 3),
            position: new Vector3(
                curvePoints[2].x + 6,
                curvePoints[2].y - 7,
                curvePoints[2].z + 50
            ),
        },
        {
            scale: new Vector3(2, 2, 2),
            position: new Vector3(
                curvePoints[2].x - 2,
                curvePoints[2].y + 4,
                curvePoints[2].z - 26
            ),
        },
        {
            scale: new Vector3(4, 4, 4),
            position: new Vector3(
                curvePoints[2].x + 12,
                curvePoints[2].y + 1,
                curvePoints[2].z - 86
            ),
            rotation: new Euler(Math.PI / 4, 0, Math.PI / 3),
        },
        // THIRD POINT
        {
            scale: new Vector3(3, 3, 3),
            position: new Vector3(
                curvePoints[3].x + 3,
                curvePoints[3].y - 10,
                curvePoints[3].z + 50
            ),
        },
        {
            scale: new Vector3(3, 3, 3),
            position: new Vector3(
                curvePoints[3].x - 10,
                curvePoints[3].y,
                curvePoints[3].z + 30
            ),
            rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
        },
        {
            scale: new Vector3(4, 4, 4),
            position: new Vector3(
                curvePoints[3].x - 20,
                curvePoints[3].y - 5,
                curvePoints[3].z - 8
            ),
            rotation: new Euler(Math.PI, 0, Math.PI / 5),
        },
        {
            scale: new Vector3(5, 5, 5),
            position: new Vector3(
                curvePoints[3].x + 0,
                curvePoints[3].y - 5,
                curvePoints[3].z - 98
            ),
            rotation: new Euler(0, Math.PI / 3, 0),
        },
        // FOURTH POINT
        {
            scale: new Vector3(2, 2, 2),
            position: new Vector3(
                curvePoints[4].x + 3,
                curvePoints[4].y - 10,
                curvePoints[4].z + 2
            ),
        },
        {
            scale: new Vector3(3, 3, 3),
            position: new Vector3(
                curvePoints[4].x + 24,
                curvePoints[4].y - 6,
                curvePoints[4].z - 42
            ),
            rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
        },
        {
            scale: new Vector3(3, 3, 3),
            position: new Vector3(
                curvePoints[4].x - 4,
                curvePoints[4].y + 9,
                curvePoints[4].z - 62
            ),
            rotation: new Euler(Math.PI / 3, 0, Math.PI / 3),
        },
        // FINAL
        {
            scale: new Vector3(3, 3, 3),
            position: new Vector3(
                curvePoints[7].x + 12,
                curvePoints[7].y - 5,
                curvePoints[7].z + 60
            ),
            rotation: new Euler(-Math.PI / 4, -Math.PI / 6, 0),
        },
        {
            scale: new Vector3(3, 3, 3),
            position: new Vector3(
                curvePoints[7].x - 12,
                curvePoints[7].y + 5,
                curvePoints[7].z + 120
            ),
            rotation: new Euler(Math.PI / 4, Math.PI / 6, 0),
        },
        {
            scale: new Vector3(4, 4, 4),
            position: new Vector3(
                curvePoints[7].x,
                curvePoints[7].y,
                curvePoints[7].z
            ),
            rotation: new Euler(0, 0, 0),
        }
    ], []);

    // State management of the app
    const {play, setHasScroll, end, setEnd} = usePlay();

    // Will be called every frame to set up the logic
    useFrame((_state, delta) => {
            // Set the hasScroll to true when the user first scrolls
            if (lastScroll.current <= 0 && scroll.offset > 0) {
                setHasScroll(true);
            }

            // Will make the opacity to 1 when the play button is pressed of the experience objects (clouds, line, etc.)
            if (play && !end && sceneOpacity.current < 1) {
                sceneOpacity.current = THREE.MathUtils.lerp(
                    sceneOpacity.current,
                    1,
                    delta * 0.1
                );
            }

            // Will make the opacity to 0 when the plane has reached the end of the journey
            if (end && sceneOpacity.current > 0) {
                sceneOpacity.current = THREE.MathUtils.lerp(
                    sceneOpacity.current,
                    0,
                    delta
                );
            }

            // Update the opacity of the scene
            lineMaterialRef.current.opacity = sceneOpacity.current;

            // Stop movement when the plane has reached the end of the journey
            if (end) {
                return;
            }

            // Get the current point of the scrolling
            const scrollOffset = Math.max(0, scroll.offset);
            // Reset the position of the camera rail
            let resetCameraRail = true;
            // Friction of the camera rail, 1 means no friction (the plane is not approaching a text section)
            let friction = 1;

            // Look to close text sections
            textSections.forEach((textSection) => {
                // Get the distance between the camera and the text section
                const distance = textSection.position.distanceTo(cameraGroup.current.position);

                // Make the plane move to the side of the curve when approaching a text section
                if (distance < FRICTION_DISTANCE) {
                    // Slow down the camera rail
                    friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
                    const targetCameraRailPosition = new Vector3(
                        (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
                        0,
                        -1
                    );
                    cameraRail.current.position.lerp(targetCameraRailPosition, delta);
                    resetCameraRail = false;
                }
            });

            // Reset the camera rail position when the text section was left
            if (resetCameraRail) {
                const targetCameraRailPosition = new Vector3(0, 0, 0);
                cameraRail.current.position.lerp(targetCameraRailPosition, delta);
            }

            // Calculate the lerped (linear interpolation) scroll offset
            let lerpedScrollOffset = THREE.MathUtils.lerp(
                lastScroll.current,
                scrollOffset,
                delta * friction
            );

            // Set the values between 0 and 1 to not go out of the curve too much
            lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
            lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

            // Set the last scroll offset
            lastScroll.current = lerpedScrollOffset;
            // Change the background color based on the scroll offset
            timeline.current.seek(lerpedScrollOffset * timeline.current.duration());

            // Sets point of the scrolling
            const currentPoint = curve.getPoint(lerpedScrollOffset);

            // Makes the camera follow the curve points
            cameraGroup.current.position.lerp(currentPoint, delta * 24);


            /* Makes the group look ahead on the curve (better animation) */
            // Look at the current point of the camera and the airplane
            const lookAtPoint = curve.getPoint(
                Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
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
            const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE);

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
            // (quaternion is a mathematical representation used to describe rotations in 3D space)
            const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
                new THREE.Euler(
                    airplane.current.rotation.x,
                    airplane.current.rotation.y,
                    angle
                )
            );
            airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);

            // Check if the plane has reached the end of the journey
            if (cameraGroup.current.position.z < curvePoints[curvePoints.length - 1].z + 100) {
                setEnd(true);
                planeOutTimeline.current.play();
            }
        }
    );

    /* GSAP animations */
    // The timeline that will be used to animate the background colors
    const timeline = useRef();
    // The current background colors
    const backgroundColors = useRef({
        colorA: "#3535cc",
        colorB: "#abaadd",
    });

    // Plane ref that will be used to animate the plane fadeIn once user clicked explore
    const planeInTimeline = useRef();
    const planeOutTimeline = useRef();

    useLayoutEffect(() => {
        timeline.current = gsap.timeline();

        timeline.current.to(backgroundColors.current, {
            duration: 1,
            colorA: "#6f35cc",
            colorB: "#ffad30",
        });
        timeline.current.to(backgroundColors.current, {
            duration: 1,
            colorA: "#424242",
            colorB: "#ffcc00",
        });
        timeline.current.to(backgroundColors.current, {
            duration: 1,
            colorA: "#81318b",
            colorB: "#55ab8f",
        });

        timeline.current.pause();

        // Plane fadeIn animation
        planeInTimeline.current = gsap.timeline();
        planeInTimeline.current.pause();
        planeInTimeline.current.from(airplane.current.position, {
            duration: 3,
            z: 5,
            y: -2
        });

        // Plane fadeOut animation
        planeOutTimeline.current = gsap.timeline();
        planeOutTimeline.current.pause();

        planeOutTimeline.current.to(
            airplane.current.position,
            {
                duration: 10,
                z: -250,
                y: 10,
            },
            0
        );
        planeOutTimeline.current.to(
            cameraRail.current.position,
            {
                duration: 8,
                y: 12,
            },
            0
        );
        planeOutTimeline.current.to(airplane.current.position, {
            duration: 1,
            z: -1000,
        });
    }, []);

    useEffect(() => {
        // Play the plane fadeIn animation once the user clicked explore
        if (play) {
            planeInTimeline.current.play();
        }
    }, [play]);

    // UseMemo is used to prevent re-rendering of the component when the user first scrolls (check without UseMemo)
    return useMemo(() => (
            <>
                <directionalLight position={[0, 3, 1]} intensity={0.5}/>
                {/*<OrbitControls/>*/}
                <group ref={cameraGroup}>
                    <Background backgroundColors={backgroundColors}/>
                    <group ref={cameraRail}>
                        <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault/>
                    </group>
                    <group ref={airplane}>
                        <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
                            <Airplane rotation-y={Math.PI / 2} scale={[0.2, 0.2, 0.2]} position-y={-0.05} position-x={0}/>
                            {/*<PaperAirplane rotation-y={Math.PI * 2}*/}
                            {/*               rotation-x={Math.PI / 8}*/}
                            {/*               scale={[0.005, 0.005, 0.005]}*/}
                            {/*               position-y={-0.75}/>*/}
                        </Float>
                    </group>
                </group>

                {/* Text objects */}
                {textSections.map((textSection, index) => (
                    <TextSection {...textSection} key={index}/>
                ))}

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
                            ref={lineMaterialRef}
                            color={"white"}
                            opacity={1}
                            transparent
                            envMapIntensity={2}
                            onBeforeCompile={fadeOnBeforeCompile}
                        />
                    </mesh>
                </group>

                {/* Clouds objects */}
                {clouds.map((cloud, index) => (
                    <Cloud_v2 sceneOpacity={sceneOpacity} {...cloud} key={index}/>
                ))}
            </>
        ), []
    );
};
