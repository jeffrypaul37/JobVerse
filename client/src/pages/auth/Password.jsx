import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../assets/Profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";

import styles from "./styles/Username.module.css";
import { useAuthStore, useSocketStore } from "../../store/store";
import useFetch from "../../hooks/fetch.hook";
import { passwordValidate } from "./helper/validate";
import { verifyPassword } from "./helper/api";

export default function Password() {
  const initializeSocket = useSocketStore((state) => state.initializeSocket);
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({
        username,
        password: values.password,
      });

      await toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Login Successfully!</b>,
        error: <b>Password Not Match!</b>,
      });

      loginPromise.then((res) => {
        const { token, username, email } = res.data;
        console.log(res.data)
        localStorage.setItem("token", token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        initializeSocket(token, username);
        let role = localStorage.getItem('role');
        if (role === 'Recruiter') {
          navigate("/recruiter/dashboard");
        } else {
          navigate("/search")
        }
      });
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto px-4">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className={`${styles.glass}`}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl sm:text-5xl font-bold">
              Hello {apiData?.firstName || apiData?.username}!
            </h4>
            <span className="py-4 text-lg sm:text-xl w-full text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={apiData?.profile || avatar}
                className={styles.profile_img}
                alt="avatar"
              />
            </div>

            <div className="textbox flex flex-col items-center gap-4 sm:gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="Password"
              />
              <button className={styles.btn} type="submit">
                Sign In
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot Password?{" "}
                <Link className="text-red-500" to="/recovery">
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
