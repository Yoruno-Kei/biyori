import React, { useState } from "react";
import SpeechBubble   from "../components/SpeechBubble";
import HiyoriAvatar   from "../components/HiyoriAvatar";
import { liftLines }  from "../utils/speechPresets";
import Ground         from "../components/Ground";
import useHiyoriLogic from "../hooks/useHiyoriLogic";
import TopSwiper from "../components/TopSwiper";
import PersonalModal   from "../components/PersonalModal";
import { AppDataProvider } from "../contexts/AppDataContext";

export default function Home(){
  const {
    text,mood,pose,direction,animClass,showBubble,
    isWalking,isSpeaking,
    handleTap,handleSlide,speakFixedLine,handlePosUpdate,setIsWalking,
    posRef,speakDropLine,setDirection
  } = useHiyoriLogic();

  const [openModal, setOpenModal] = useState(false);

  return(
    <AppDataProvider>
      <div className="min-h-screen flex flex-col justify-end overflow-hidden">
      <TopSwiper />
        {/* ⚙ ボタン */}
        <button onClick={()=>setOpenModal(true)}
                className="fixed top-2 right-2 z-30 text-xl">⚙</button>
      <Ground/>
      <div className={animClass}>
        <HiyoriAvatar
        pose={pose}
        direction={direction}
        isSpeaking={isSpeaking}
        setDirection={setDirection}
        onTap={handleTap}
        onLifted={() => speakFixedLine(liftLines, "warning")}        /* liftLines はデフォルト引数で使用 */
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
              {/* ③ モーダル */}
              <PersonalModal open={openModal} onClose={() => setOpenModal(false)} />
      </div>
    </AppDataProvider>
  );
}
