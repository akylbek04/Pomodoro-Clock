import { FaPause, FaPlay, FaUndo } from "react-icons/fa";
import { DisplayState, formatTime } from "./helper";

interface DisplayProps {
  displayState: DisplayState;
  reset: () => void;
  startStop: (displayState: DisplayState) => void;
}

const Display: React.FC<DisplayProps> = ({
  displayState,
  reset,
  startStop,
}) => {
  return (
    <div className="display">
      <h4 id="timer-label">{displayState.timeType}</h4>
      <span
        id="time-left"
        style={{ color: `${displayState.timeRunning ? "red" : "white"}` }}
      >
        {formatTime(displayState.time)}
      </span>
      <div className="btn-container">
        <button id="start_stop" onClick={() => startStop(displayState)}>
          {displayState.timeRunning ? <FaPause /> : <FaPlay />}
        </button>
        <button id="reset" onClick={reset}>
          <FaUndo />
        </button>
      </div>
    </div>
  );
};

export default Display;
