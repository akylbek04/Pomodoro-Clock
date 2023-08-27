import { useEffect, useState } from "react";
import "./App.css";
import { DisplayState } from "./helper";
import TimeSetter from "./TimeSetter";
import Display from "./Display";
import alarmSound from "./assets/alarmSound.mp3";

const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timeRunning: false,
  });

  useEffect(() => {
    let timerId: number;

    if (!displayState.timeRunning) return;

    if (displayState.timeRunning) {
      timerId = window.setInterval(decrementDisplay, 1000);
    }

    return () => {
      window.clearInterval(timerId);
    };
  }, [displayState.timeRunning]);

  useEffect(() => {
    if(displayState.time === 0){
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime  = 2;
      audio.play().catch((err) => console.log(err));
      setDisplayState(prev => ({
        ...prev,
        timeType: prev.timeType === "Session" ? "Break" : "Session",
        time: prev.timeType === "Session" ? breakTime : sessionTime
      }))
    }
  }, [displayState, breakTime, sessionTime])

  const reset = () => {
    setBreakTime(defaultBreakTime);
    setSessionTime(defaultSessionTime);
    setDisplayState({
      time: defaultSessionTime,
      timeType: "Session",
      timeRunning: false,
    });

    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  };

  const startStop = () => {
    setDisplayState((prev) => ({
      ...prev,
      timeRunning: !displayState.timeRunning,
    }));
  };

  const changeBreakTime = (time: number) => {
    if (displayState.timeRunning) return;
    setBreakTime(time);
  };
  const changeSessionTime = (time: number) => {
    if (displayState.timeRunning) return;
    setSessionTime(time);
    setDisplayState({
      time: time,
      timeType: "Session",
      timeRunning: false,
    });
  };

  const decrementDisplay = () => {
    setDisplayState((prev) => ({
      ...prev,
      time: prev.time - 1,
    }));
  };

  return (
    <div className="clock">
      <div className="setters">
        <div className="break">
          <h4 id="break-label">Break length</h4>
          <TimeSetter
            time={breakTime}
            setTime={changeBreakTime}
            min={min}
            max={max}
            interval={interval}
            type="break"
          />
        </div>
        <div className="session">
          <h4 id="session-label">Session length</h4>
          <TimeSetter
            time={sessionTime}
            setTime={changeSessionTime}
            min={min}
            max={max}
            interval={interval}
            type="session"
          />
        </div>
      </div>
      <Display
        displayState={displayState}
        reset={reset}
        startStop={startStop}
      />
      <audio id="beep" src={alarmSound}></audio>
    </div>
  );
}

export default App;
