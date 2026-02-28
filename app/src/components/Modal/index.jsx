import "./style.css";
import { AiFillCloseCircle } from "react-icons/ai";

const Modal = ({ isOpen, handlClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <div className="closeButton">
              <button
                onClick={() => {
                  handlClose(false);
                }}
                style={{ color: "white", fontSize: "30px", padding: "10px" }}>
                {" "}
                <AiFillCloseCircle />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
