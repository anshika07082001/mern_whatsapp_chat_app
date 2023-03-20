import axios from "axios";
import React from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  // state for dynamic rendering of login input fields
  const [loginArr, setLoginArr] = useState([
    {
      label: "Login With Phone/Email",
      type: "text",
      placeholder: "Enter Your Mobile number or Email",
      text: "Must be same as filled during registration",
      value: "",
      error: false,
    },
    {
      label: "Password",
      type: "password",
      placeholder: "Enter Password",
      text: "Must be same as filled during registration",
      value: "",
      error: false,
    },
  ]);
  // state for showing error messages
  const [msg, setMsg] = useState("");
  let navigate = useNavigate();
  // function for setting the state of login input boxes on onchangeHandler
  const loginInpsHandler = (e) => {
    let label = e.target.getAttribute("label");
    let cond = (ele) => ele.label === label;
    let ele = loginArr.find(cond);
    if (e.target.value.match(ele.regex)) {
      ele.value = e.target.value;
    }
    setLoginArr([...loginArr]);
  };
  // function for storing the login users data in backened and also checks for any empty field runs on login button handler
  const loginHandler = async (e) => {
    e.preventDefault();
    loginArr.forEach((item) => {
      // condition checks for any empty fields
      if (item.value === "") {
        item.error = true;
      } else {
        item.error = false;
      }
    });
    setLoginArr([...loginArr]);
    let cond = (ele) => ele.value === "";
    let ele = loginArr.find(cond);
    if (ele === undefined) {
      let login = loginArr[0].value;
      let password = loginArr[1].value;
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/user/login",
          { login, password },
          config
        );
        setMsg("Login Sucessfully!!");
        navigate("/");
        localStorage.setItem("loginUser", JSON.stringify(data));
      } catch (error) {
        setMsg("fill login credentials correctly!!");
        console.log(error);
      }
      e.target.reset();
    }
  };

  return (
    <div className="col-10 d-flex flex-column gap-3 col-sm-8 col-lg-6 my-4 m-auto rounded ">
      <div className="col-10 m-auto rounded">
        <h3 className="text-center p-1">Chat App</h3>
      </div>
      <Form className="col-10 m-auto p-3 rounded" onSubmit={loginHandler}>
        {/* rendering of error messages */}
        <p
          className={`text-center ${
            msg === "Login Sucessfully!!" ? "text-success" : "text-danger"
          }`}
        >
          {msg}
        </p>
        {/* dynamic rendering of login input fields */}
        {loginArr.map((item, i) => {
          return (
            <Form.Group className="mb-2" key={i}>
              <Form.Label className="mb-1">
                {item.label}
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type={item.type}
                placeholder={item.placeholder}
                label={item.label}
                onChange={(e) => loginInpsHandler(e)}
                className={item.error ? "border-danger" : ""}
              />
              <Form.Text
                className={item.error ? "text-danger" : "text-secondary"}
              >
                {item.text}
              </Form.Text>
            </Form.Group>
          );
        })}
        <p>
          Don't have an account &nbsp;
          {/* link for signup page */}
          <Link to="/signup">Sign Up</Link>
        </p>
        <Button type="submit" className="col-12 border-0 btn__color">
          Submit
        </Button>
        {/* <Button variant="danger" className="col-12 mt-2">
          Get User Credentials
        </Button> */}
      </Form>
    </div>
  );
};

export default Login;
