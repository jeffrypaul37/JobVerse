/* Author: Bhishman Desai */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../assets/Profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "./helper/validate";
import convertToBase64 from "./helper/convert";
import styles from "./styles/Username.module.css";
import { registerUser } from "./helper/api";

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      role: "Student",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      /* Set role based on dropdown selection */
      if (values.role === "Recruiter") {
        values = { ...values, roles: { Recruiter: 1984 } };
      } else if (values.role === "Admin") {
        values = { ...values, roles: { Admin: 5150 } };
      } else {
        values = { ...values, roles: { Student: 2001 } };
      }

      values = await Object.assign(values, { profile: file || "" });

      let registerPromise = registerUser(values);

      await toast.promise(registerPromise, {
        loading: "Creating...",
        success: <b>Registered Successfully!</b>,
        error: (err) => <b>{err.error.response?.data?.error}</b>,
      });

      registerPromise.then(function () {
        navigate("/");
      });
    },
  });

  /* Formik doesn't support file upload, so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col justify-center items-center min-h-screen">
        {/* Responsive container for the form */}
        <div
          className={`${styles.glass} p-4 sm:p-8 md:p-12`}
          style={{ width: "100%", maxWidth: "500px", height: "auto" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl sm:text-5xl font-bold">Register</h4>
            <span className="py-4 text-lg sm:text-xl w-full text-center text-gray-500">
              Happy to join you!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </label>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>

            <div className="textbox flex flex-col items-center gap-4 sm:gap-6">
              <input
                {...formik.getFieldProps("email")}
                className={styles.textbox}
                type="text"
                placeholder="Email*"
              />
              <input
                {...formik.getFieldProps("username")}
                className={styles.textbox}
                type="text"
                placeholder="Username*"
              />
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="Password*"
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
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered?{" "}
                <Link className="text-red-500" to="/login">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
