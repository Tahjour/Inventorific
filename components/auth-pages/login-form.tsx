// D: \Projects\Personal_Projects\nextjs - inventory - control\components\auth - pages\login - form.js;
import { useNotification } from "@/context/notification-context";
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
  const { loginUser, loginUserWithGoogle, getPreferredListType } = useUserInfoContext();
  const { showNotification } = useNotification();
  const { setServerItemsWereLoaded, setServerLoadWasTried } = useUserInfoContext();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidate,
    onSubmit: loginFormSubmitHandler,
  });

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

        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className={styles.inputBox}>
            <div className={styles.inputSubBox}>
              <input
                className={`${styles.textInput} ${
                  formik.errors.email && formik.touched.email ? styles.errorTextInput : null
                }`}
                type="email"
                id="email"
                {...formik.getFieldProps("email")}
              />
              <label
                className={`${styles.inputLabel} ${formik.values.email && styles.inputActive} ${
                  formik.errors.email && formik.touched.email ? styles.errorLabel : null
                }`}
              >
                Email
              </label>
              <MdAlternateEmail className={styles.inputIcons} />
            </div>
            <AnimatePresence>
              {formik.errors.email && formik.touched.email && (
                <motion.span
                  className={styles.errorMessage}
                  key="errorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formik.errors.email}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.inputBox}>
            <div className={styles.inputSubBox}>
              <input
                className={`${styles.textInput} ${
                  formik.errors.password && formik.touched.password ? styles.errorTextInput : null
                }`}
                type={showPassword ? "text" : "password"}
                id="password"
                {...formik.getFieldProps("password")}
              ></input>
              <label
                className={`${styles.inputLabel} ${formik.values.password && styles.inputActive} ${
                  formik.errors.password && formik.touched.password ? styles.errorLabel : null
                }`}
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
              {formik.errors.password && formik.touched.password && (
                <motion.span
                  className={styles.errorMessage}
                  key="errorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formik.errors.password}
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

          <div className={styles.loginOrSignUpPart}>
            {"Don't have an account? "}
            <Link href={"/register"} className={styles.toggleBtn}>
              {"Sign Up"}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginForm;
