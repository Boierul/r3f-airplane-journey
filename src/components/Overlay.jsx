import React, {useState} from 'react';
import {useProgress} from "@react-three/drei";
import {usePlay} from "../context/Play.jsx";

function Overlay() {
    const {progress} = useProgress();
    const {play, setPlay, hasScroll, end} = usePlay();

    const [refreshClicked, setrefreshClicked] = useState(false);

    const refreshPage = () => {
        setrefreshClicked(true);
        // Activate animation on overlay
        const overlay = document.querySelector(".loader");
        overlay.classList.remove("loader-disappear");

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    return (
        <div className={`overlay ${play ? "overlay-disable" : ""} ${hasScroll ? "overlay-scrolled" : ""}`}>
            <div className={`loader ${progress === 100 ? "loader-disappear" : ""}`}/>
            {
                progress === 100 && (
                    <div className={`intro ${play ? "intro-disappear" : ""}`}>
                        <h1 className="logo">AIRPLANE JOURNEY
                            <div className="spinner">
                                <div className="spinner-image"/>
                            </div>
                        </h1>
                        <p className="intro-scroll">Scroll to begin the journey</p>
                        <button className="explore" onClick={() => {
                            setPlay(true);
                        }}>
                            EXPLORE
                        </button>
                    </div>
                )
            }
            <div className={`outro ${end ? "outro-appear" : "outro-disappear"}`}>
                <p className="outro-text">
                    Thank you for taking this journey with me. <br/>
                    I hope you enjoyed it as much as I did making it.
                    <button className={`explore-again ${refreshClicked ? "explore-again-disappear": ""}`} onClick={refreshPage}>
                        EXPLORE AGAIN
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Overlay;