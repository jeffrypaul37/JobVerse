/* Author: Bhishman Desai */
import toast from "react-hot-toast";
import { authenticate, getUser } from "./api";

/* Validate login page username */
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);

  if (values.username) {
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exist = toast.error("User does not exist!");
    } else {
      const { data } = await getUser({ username: values.username });
      /* If the selected Role does not match, then throw error */
      if(!Object.keys(data.roles).includes(values.role)){
        errors.exist = toast.error("Incorrect Role Selection!");
      }
    }
  }

  return errors;
}

/* Validate password */
export async function passwordValidate(values) {
  return passwordVerify({}, values);
}

/* Validate Reset Password */
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_password) {
    errors.exist = toast.error("Passwords do not match!");
  }

  return errors;
}

/* Validate Register Form */
export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}

/* Validate Profile Page */
export async function profileValidation(values) {
  return emailVerify({}, values);
}

/* Helper functions */

/* Validate Password */
function passwordVerify(errors = {}, values) {
  /* eslint-disable no-useless-escape */
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const lowerCase = /[a-z]/;
  const upperCase = /[A-Z]/;
  const number = /[0-9]/;

  if (!values.password) {
    errors.password = toast.error("Password Required!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Invalid Password!");
  } else if (
    values.password.length < 8 ||
    !specialChars.test(values.password) ||
    !lowerCase.test(values.password) ||
    !upperCase.test(values.password) ||
    !number.test(values.password)
  ) {
    errors.password = toast.error(
      "Password must be at least 8 characters long, contain a special character, a lowercase letter, an uppercase letter and a number!",
      { duration: 6000 },
    );
  }

  return errors;
}

/* Validate Username */
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username Required!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username!");
  }

  return error;
}

/* Validate Email */
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address!");
  }

  return error;
}
