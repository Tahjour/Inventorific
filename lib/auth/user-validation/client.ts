// lib\auth\user-validation\client.ts
import { LoginValues, RegisterValues } from "@/lib/types/form-authentication";
import { FormikErrors } from "formik";

export function loginValidate(values: LoginValues) {
  const errors: FormikErrors<LoginValues> = {};

  //validation for emailOrUsername
  if (!values.email) {
    errors.email = "Email required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email";
  }
  //validation for password
  if (!values.password) {
    errors.password = "Password required";
  } else if (values.password.length < 8 || values.password.length > 20) {
    errors.password = "Must be greater than 8 and less than 20";
  } else if (values.password.includes(" ")) {
    errors.password = "Invalid password";
  }

  return errors;
}

export function registerValidate(values: RegisterValues) {
  const errors: FormikErrors<RegisterValues> = {};
  if (!values.name) {
    errors.name = "Name is required";
  } else if (/[^\w\s]/.test(values.name)) {
    errors.name = "Invalid name";
  }

  if (!values.email) {
    errors.email = "Email required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email";
  }

  if (!values.password) {
    errors.password = "Password required";
  } else if (values.password.length < 8 || values.password.length > 20) {
    errors.password = "Must be greater than 8 and less than 20";
  } else if (values.password.includes(" ")) {
    errors.password = "Invalid password";
  }

  //validate confirm password
  if (!values.cpassword) {
    errors.cpassword = "Cpassword required";
  } else if (values.password !== values.cpassword) {
    errors.cpassword = "Passwords do not match";
  } else if (values.password.includes(" ")) {
    errors.cpassword = "Invalid confirm password";
  }
  return errors;
}
