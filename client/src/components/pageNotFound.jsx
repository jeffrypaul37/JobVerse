/* Author: Bhishman Desai */
import React from "react";
import styles from "../pages/auth/styles/Username.module.css";

export default function PageNotFound() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center items-center min-h-screen">
        <div className={`${styles.glass} p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20`}>
          <div className="title flex flex-col items-center">
            <h4 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center">
              404 - Page Not Found
            </h4>
            <span className="py-2 sm:py-4 text-sm sm:text-lg lg:text-xl w-full text-center text-gray-500">
              Oops! The page you are looking for does not exist.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
