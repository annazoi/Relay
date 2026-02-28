import { authStore } from "../../store/auth";
import Button from "../ui/Button";
import "./style.css";
import { VscTools } from "react-icons/vsc";

const Profile = ({ user, onClick }) => {
  const { userId } = authStore((store) => store);
  return (
    <>
      {userId === user._id ? (
        <div className="protected-profile">
          <img className="photo-profile" src={user.image} alt="" />
          <div className="profile-info">
            <p>
              <b style={{ color: "rgb(52, 83, 25)" }}>Full Name: </b>
              {user.name} {user.surname}
            </p>
            <p>
              <b style={{ color: "rgb(52, 83, 25)" }}>Username: </b>{" "}
              {user.username}
            </p>
            <p>
              <b style={{ color: "rgb(52, 83, 25)" }}>Email: </b>
              {user.email}
            </p>
            <Button label="edit " icon={<VscTools />} onClick={onClick} />
          </div>
        </div>
      ) : (
        <>
          <img className="photo-profile" src={user.image} alt="" />
          <h1 className="username">{user.username}</h1>
        </>
      )}
    </>
  );
};

export default Profile;
