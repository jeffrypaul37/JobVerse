/* Author: Bhishman Desai */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../assets/Profile.png";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";

import styles from "./styles/Username.module.css";
import { useAuthStore } from "../../store/store";
import { usernameValidate } from "./helper/validate";

export default function Username() {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);

  const formik = useFormik({
    initialValues: {
      username: "",
      role: "Student",
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      /* Handle different roles here if needed */
      setUsername(values.username);
      localStorage.setItem('role', values.role);
      navigate("/password");
    },
  });

  return (
    <div className="container mx-auto px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col justify-center items-center min-h-screen">
        <div
          className={`${styles.glass} p-4 sm:p-8 md:p-12`}
          style={{ width: "100%", maxWidth: "500px", height: "auto" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Hello Again!</h4>
            <span className="py-4 text-lg text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-4">
              <input
                {...formik.getFieldProps("username")}
                className={styles.textbox}
                type="text"
                placeholder="Username"
              />
              <select
                {...formik.getFieldProps("role")}
                className={styles.textbox}
              >
                <option value="Student">Student</option>
                <option value="Recruiter">Recruiter</option>
                <option value="Admin">Admin</option>
              </select>
              <button className={styles.btn} type="submit">
                Let's Go
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a Member{" "}
                <Link className="text-red-500" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
