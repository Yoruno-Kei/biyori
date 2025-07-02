import React from "react";
import SpeechBubble   from "../components/SpeechBubble";
import HiyoriAvatar   from "../components/HiyoriAvatar";
import { liftLines }  from "../utils/speechPresets";
import Ground         from "../components/Ground";
import useHiyoriLogic from "../hooks/useHiyoriLogic";

export default function Home(){
  const {
    text,mood,pose,direction,animClass,showBubble,
    isWalking,isSpeaking,
    handleTap,handleSlide,speakFixedLine,handlePosUpdate,setIsWalking,
    posRef,speakDropLine,setDirection
  } = useHiyoriLogic();

  return(
    <div className="min-h-screen flex flex-col items-center justify-end bg-gradient-to-t from-pink-50/70 to-white pb-10 overflow-hidden">
      <Ground/>
      <div className={animClass}>
        <HiyoriAvatar
        pose={pose}
        direction={direction}
        isSpeaking={isSpeaking}
        setDirection={setDirection}
        onTap={handleTap}
        onLifted={()=>speakFixedLine()}        /* liftLines はデフォルト引数で使用 */
        onPosUpdate={handlePosUpdate}
        speakDropLine={speakDropLine}
      />
      </div>
      {showBubble && (
        <SpeechBubble
          text={text}
          mood={mood}
          positionX={posRef.current.x}
          positionY={posRef.current.y}
        />
      )}
    </div>
  );
}
