import {Canvas} from "@react-three/fiber";
import {Experience} from "./components/Experience";
import {ScrollControls} from "@react-three/drei";
import {EffectComposer, LensFlare, Noise} from '@react-three/postprocessing';

function App() {
    return (
        <>
            <Canvas>
                <color attach="background" args={["#ececec"]}/>
                <ScrollControls pages={40} damping={0.5}>
                    <Experience/>
                </ScrollControls>
                <EffectComposer>
                    <Noise opacity={0.02} />
                </EffectComposer>
            </Canvas>
        </>
    );
}

export default App;
