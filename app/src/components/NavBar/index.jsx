import { Link } from "react-router-dom";
import "./style.css";
import { authStore } from "../../store/auth";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const NavBar = () => {
  const { logOut, isLoggedIn, userId } = authStore((store) => store);

  const [isSelected, setSelected] = useState("");

  const { pathname } = useLocation();

  const logoutUser = () => {
    logOut();
    window.location.href = "/login";
  };

  const links = [
    {
      path: "/login",
      label: "Login",
      color: "white",
      protected: false,
    },
    {
      path: "/home",
      label: "Home",
      color: "white",
      protected: false,
    },
    {
      path: `profile/${userId}`,
      label: "Profile",
      color: "white",
      protected: true,
    },
    {
      label: "Logout",
      onPress: logoutUser,
      color: "white",
      protected: true,
    },
  ];

  const onClick = (link) => {
    setSelected(link.label);
    if (link.onPress) {
      link.onPress();
    }
  };

  useEffect(() => {
    links.map((link) => {
      if (link.path === pathname) {
        setSelected(link.label);
      }
    });
  }, []);

  return (
    <>
      <div className="nav-bar-container">
        <div className="link-items">
          {links.map((link, index) => {
            if (link.protected && isLoggedIn) {
              return (
                <Link
                  key={index}
                  className="link-content"
                  style={{
                    backgroundColor:
                      isSelected === link.label
                        ? "rgb(93, 112, 108) "
                        : " rgba(134, 112, 144, 0.5)",
                  }}
                  to={link.path}
                  onClick={() => onClick(link)}
                >
                  {" "}
                  {link.label}{" "}
                </Link>
              );
            } else if (!link.protected) {
              return (
                <Link
                  key={index}
                  className="link-content"
                  style={{
                    backgroundColor:
                      isSelected === link.label
                        ? "rgb(93, 112, 108) "
                        : " rgba(134, 112, 144, 0.5)",
                  }}
                  to={link.path}
                  onClick={() => onClick(link)}
                >
                  {" "}
                  {link.label}{" "}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

export default NavBar;
