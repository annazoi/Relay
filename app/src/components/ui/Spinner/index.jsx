import "./style.css";
import BeatLoader from "react-spinners/BeatLoader";

const Spinner = ({ loading }) => {
  return (
    <div className="spinner-container">
      <BeatLoader
        color="rgb(43, 80, 70)"
        loading={loading}
        // cssOverride={override}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;
