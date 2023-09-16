// D: \Projects\Personal_Projects\nextjs - inventory - control\components\auth - pages\login - form.js;
import { useUserInfoContext } from "@/context/user-context";
import { loginValidate } from "@/lib/auth/user-validation/client";
import { LoginValues } from "@/lib/types/form-authentication";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdAlternateEmail } from "react-icons/md";

function LoginForm() {
  const { loginUser, loginUserWithGoogle } = useUserInfoContext();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidate,
    onSubmit: loginFormSubmitHandler,
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  async function loginFormSubmitHandler(values: LoginValues) {
    await loginUser(values);
  }

  async function googleLoginHandler() {
    await loginUserWithGoogle();
  }

  return (
    <section className="authFormSectionBox">
      <div className="authFormBox">
        <h1>Login to Your Account</h1>

        <form className="authForm" onSubmit={handleSubmit}>
          <div className="authInputBox">
            <div className="authInputBox2">
              <input
                className={`${"authTextInput"} ${
                  !errors.email && touched.email && "authSuccessOutline"
                } ${errors.email && touched.email && "authErrorOutline"}`}
                type="email"
                id="email"
                {...getFieldProps("email")}
              />
              <label
                className={`${"authInputLabel"} ${
                  !errors.email && touched.email && "authSuccessLabel"
                } ${errors.email && touched.email && "authErrorLabel"}`}
              >
                Email
              </label>
              <MdAlternateEmail className="authInputIcons" />
            </div>
            <AnimatePresence>
              {errors.email && touched.email && (
                <motion.span
                  className="authErrorMessage"
                  key="errorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.email}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="authInputBox">
            <div className="authInputBox2">
              <input
                className={`${"authTextInput"} ${
                  !errors.password && touched.password && "authSuccessOutline"
                } ${errors.password && touched.password && "authErrorOutline"}`}
                type={showPassword ? "text" : "password"}
                id="password"
                {...getFieldProps("password")}
              ></input>
              <label
                className={`${"authInputLabel"} ${
                  !errors.password && touched.password && "authSuccessLabel"
                } ${errors.password && touched.password && "authErrorLabel"}`}
              >
                Password
              </label>
              {showPassword ? (
                <FiEye
                  className="authInputIcons"
                  onClick={() => {
                    setShowPassword(false);
                  }}
                />
              ) : (
                <FiEyeOff
                  className="authInputIcons"
                  onClick={() => {
                    setShowPassword(true);
                  }}
                />
              )}
            </div>
            <AnimatePresence>
              {errors.password && touched.password && (
                <motion.span
                  className="authErrorMessage"
                  key="errorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.password}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button type="submit" className="authSubmitBtn">
            {"Submit"}
          </button>

          <div className="authSeparatorLine">
            <span>or</span>
          </div>
          <button type="button" className="authGoogleBtn" onClick={googleLoginHandler}>
            <FcGoogle size={25} /> {"Login with Google"}
          </button>

          <div className="authLoginOrSignUpBox">
            {"Don't have an account? "}
            <Link href={"/register"} className="authLoginOrSignUpBtn">
              {"Sign Up"}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginForm;
