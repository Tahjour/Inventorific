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
import styles from "./auth-pages.module.css";

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
  const { values, errors, touched, handleSubmit, getFieldProps } = formik;

  async function loginFormSubmitHandler(values: LoginValues) {
    await loginUser(values);
  }

  async function googleLoginHandler() {
    await loginUserWithGoogle();
  }

  return (
    <section className={styles.formBox}>
      <div className={styles.formOuter}>
        <h1>Login to Your Account</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <div className={styles.inputBox2}>
              <input
                className={`${styles.textInput} ${
                  !errors.email && touched.email && styles.successOutline
                } ${errors.email && touched.email && styles.errorOutline}`}
                type="email"
                id="email"
                {...getFieldProps("email")}
              />
              <label
                className={`${styles.inputLabel} ${
                  !errors.email && touched.email && styles.successLabel
                } ${errors.email && touched.email && styles.errorLabel}`}
              >
                Email
              </label>
              <MdAlternateEmail className={styles.inputIcons} />
            </div>
            <AnimatePresence>
              {errors.email && touched.email && (
                <motion.span
                  className={styles.errorMessage}
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

          <div className={styles.inputBox}>
            <div className={styles.inputBox2}>
              <input
                className={`${styles.textInput} ${
                  !errors.password && touched.password && styles.successOutline
                } ${errors.password && touched.password && styles.errorOutline}`}
                type={showPassword ? "text" : "password"}
                id="password"
                {...getFieldProps("password")}
              ></input>
              <label
                className={`${styles.inputLabel} ${
                  !errors.password && touched.password && styles.successLabel
                } ${errors.password && touched.password && styles.errorLabel}`}
              >
                Password
              </label>
              {showPassword ? (
                <FiEye
                  className={styles.inputIcons}
                  onClick={() => {
                    setShowPassword(false);
                  }}
                />
              ) : (
                <FiEyeOff
                  className={styles.inputIcons}
                  onClick={() => {
                    setShowPassword(true);
                  }}
                />
              )}
            </div>
            <AnimatePresence>
              {errors.password && touched.password && (
                <motion.span
                  className={styles.errorMessage}
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

          <button type="submit" className={styles.submitBtn}>
            {"Submit"}
          </button>

          <div className={styles.separatorLine}>
            <span>or</span>
          </div>
          <button type="button" className={styles.googleBtn} onClick={googleLoginHandler}>
            <FcGoogle size={25} /> {"Login with Google"}
          </button>

          <div className={styles.loginOrSignUpBox}>
            {"Don't have an account? "}
            <Link href={"/register"} className={styles.loginOrSignUpBtn}>
              {"Sign Up"}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginForm;
