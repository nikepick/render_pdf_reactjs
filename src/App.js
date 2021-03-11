import "./App.css";
import axios from "axios";
import React, { useState, useContext } from "react";
import { Document } from "react-pdf";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [pdf, setPdf] = useState("");

  

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post(api, {
        email: email,
        password: password,
      })
      .then(function (response) {
        const res = response.data;
        console.log(res);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user_id", res.user.id);
        localStorage.setItem("username", res.user.name);
        localStorage.setItem("email", email);
        const token = res.token;

        axios(
          api,
          {
            method: "GET",
            responseType: "blob", //Force to receive data in a Blob Format
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
          .then((response) => {
            //Create a Blob from the PDF Stream
            const file = new Blob([response.data], {
              type: "application/pdf",
            });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            setPdf(fileURL);
            setIsPdf(true);
            //Open the URL on new Window
            //window.open(fileURL);
          })
          .catch((error) => {
            console.log(error);
          });

      })
      .catch(function (error) {});
  };

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="text"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit" className="btn btn-primary btn-block">
          Submit
        </button>
      </form>
      
      {isPdf ? (
       <iframe style={{height:'90vh',width:'100%'}} src={pdf}></iframe>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;