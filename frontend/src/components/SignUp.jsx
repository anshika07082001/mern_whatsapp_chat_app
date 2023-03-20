import axios from "axios";
import React from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const SignUp = () => {
  // state for dynamic rendering of signup form input boxes
  const [signArr, setsignArr] = useState([
    {
      label: "Name",
      type: "text",
      placeholder: "Enter Yor Name",
      text: "name contains first letter of first and last name capital",
      value: "",
      regex: /^[A-Z][a-z]+ [A-Z][a-z]+$/,
      error: false,
    },
    {
      label: "Email",
      type: "email",
      placeholder: "Enter your Email",
      text: "email must follow this format (abc12@gmail.com)",
      value: "",
      regex: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
      error: false,
    },
    {
      label: "Phone Number",
      type: "number",
      placeholder: "Enter Your Mobile Number",
      text: "number must be of 10 digits",
      value: "",
      regex: /^[0-9]{10}$/,
      error: false,
    },
    {
      label: "Password",
      type: "password",
      placeholder: "Enter Password",
      text: "password have atleast of 8 characters must follow this (Aabc@2121)",
      value: "",
      regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/,
      error: false,
    },
  ]);
  // state for pic uploading
  const [pic, setPic] = useState({
    label: "Upload Your Picture",
    text: "Select image of type jpeg or png",
    value:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
    error: false,
  });
  // state for showing message
  const [msg, setMsg] = useState("");
  // function for setting the state of signup input boxes on onchangeHandler
  const signInpsHandler = (e) => {
    let label = e.target.getAttribute("label");
    let cond = (ele) => ele.label === label;
    let ele = signArr.find(cond);
    if (e.target.value.match(ele.regex)) {
      ele.value = e.target.value;
      ele.error = false;
    } else {
      ele.error = true;
    }
    setsignArr([...signArr]);
  };
  // function for storing the signup users data in backened and also checks for any empty field runs on signup button handler
  const signHandler = async (e) => {
    e.preventDefault();
    signArr.forEach((item) => {
      // condition checks for any empty fields
      if (item.value === "") {
        item.error = true;
      } else {
        item.error = false;
      }
    });
    setsignArr([...signArr]);
    let cond = (ele) => ele.value === "";
    let ele = signArr.find(cond);
    if (ele === undefined) {
      let name = signArr[0].value;
      let email = signArr[1].value;
      let phone = signArr[2].value;
      let password = signArr[3].value;
      // storing the data in backened server in try block
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/user",
          { name, email, phone, password, pic: pic.value },
          config
        );
        setMsg("Registered Successfully!!");
        localStorage.setItem("UserInfo", JSON.stringify(data));
        e.target.reset();
        setTimeout(() => setMsg(""), 3000);
      } catch (error) {
        // else the error message
        setMsg(error.response.data.message);
        console.log(error);
      }
    }
  };

  // function to upload the pic with validation
  const picHandler = (e) => {
    let pics = e.target.files[0];
    if (pics.type === "image/png" || pics.type === "image/jpeg") {
      pic.error = false;
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chat App");
      data.append("cloud_name", "du0nzqh0z");
      fetch("https://api.cloudinary.com/v1_1/du0nzqh0z/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          setPic({ ...pic, value: res.url.toString(), error: false });
        });
    } else {
      setPic({ ...pic, error: true });
    }
  };
  return (
    <div className="col-10 d-flex flex-column gap-2 col-sm-8 col-lg-6 my-1 m-auto">
      <div className="col-10 m-auto">
        <h3 className="text-center">Chat App</h3>
      </div>
      <Form className="col-10 m-auto px-4 " onSubmit={signHandler}>
        {/* rendering of messages */}
        <p
          className={`text-center ${
            msg === "Registered Successfully!!" ? "text-success" : "text-danger"
          }`}
        >
          {msg}
        </p>
        {/* dynamic rendering of signup input boxes  */}
        {signArr.map((item, i) => {
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
                onChange={(e) => signInpsHandler(e)}
              />
              <Form.Text
                className={item.error ? "text-danger" : "text-secondary"}
              >
                {item.text}
              </Form.Text>
            </Form.Group>
          );
        })}
        {/* rendering of file uploading field */}
        <Form.Group>
          <Form.Label>{pic.label}</Form.Label>
          <Form.Control type="file" onChange={picHandler} />
          <Form.Text className={pic.error ? "text-danger" : "text-secondary"}>
            {pic.text}
          </Form.Text>
        </Form.Group>
        <p>
          Already have an account &nbsp;
          {/* link to naviagte to login page */}
          <Link to="/login">Login</Link>
        </p>
        <Button
          type="submit"
          variant="primary"
          className="col-12 btn__color border-0"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;
