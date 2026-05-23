import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notes from "./Notes";

function Home(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h2>Welcome to iNotebook</h2>
      {localStorage.getItem("token") && <Notes showalert={props.showalert} />}
    </div>
  );
}

export default Home;
