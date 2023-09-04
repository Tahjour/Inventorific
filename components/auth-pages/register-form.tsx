import { useUserInfoContext } from "@/context/user-context";
import { registerValidate } from "@/lib/auth/user-validation/client";
import { RegisterValues } from "@/lib/types/form-authentication";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { MdAlternateEmail } from "react-icons/md";
import styles from "./auth-pages.module.css";

function RegisterForm() {
  const { registerUser } = useUserInfoContext();
  const [showPassword, setShowPassword] = useState({
    password: false,
    cpassword: false,
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validate: registerValidate,
    onSubmit: SignUpFormSubmitHandler,
  });

  async function SignUpFormSubmitHandler(values: RegisterValues) {
    registerUser(values);
  }
  return (
    <section className={styles.formBox}>
      <div className={styles.formOuterRegister}>
        <h1>Create a New Account</h1>

        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className={styles.inputBox}>
            <div className={styles.inputSubBox}>
              <input
                className={`${styles.textInput} ${
                  formik.errors.name && formik.touched.name ? styles.errorTextInput : null
                }`}
                type="text"
                id="name"
                {...formik.getFieldProps("name")}
                required
              ></input>

              <label
                className={`${styles.inputLabel} ${formik.values.name && styles.inputActive} ${
                  formik.errors.name && formik.touched.name ? styles.errorLabel : null
                }`}
              >
                Username
              </label>

              <FiUser className={styles.inputIcons} />
            </div>
            <AnimatePresence>
              {formik.errors.name && formik.touched.name && (
                <motion.span
                  className={styles.errorMessage}
                  key="errorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formik.errors.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.inputBox}>
            <div className={styles.inputSubBox}>
              <input
                className={`${styles.textInput} ${
                  formik.errors.email && formik.touched.email ? styles.errorTextInput : null
                }`}
                type="email"
                id="email"
                {...formik.getFieldProps("email")}
                required
              ></input>
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
                type={showPassword.password ? "text" : "password"}
                id="password"
                {...formik.getFieldProps("password")}
                required
              ></input>
              <label
                className={`${styles.inputLabel} ${formik.values.password && styles.inputActive} ${
                  formik.errors.password && formik.touched.password ? styles.errorLabel : null
                }`}
              >
                Password
              </label>
              {showPassword.password ? (
                <FiEye
                  className={styles.inputIcons}
                  onClick={() => {
                    setShowPassword({ ...showPassword, password: false });
                  }}
                />
              ) : (
                <FiEyeOff
                  className={styles.inputIcons}
                  onClick={() => {
                    setShowPassword({ ...showPassword, password: true });
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

          <div className={styles.inputBox}>
            <div className={styles.inputSubBox}>
              <input
                className={`${styles.textInput} ${
                  formik.errors.cpassword && formik.touched.cpassword ? styles.errorTextInput : null
                }`}
                type={showPassword.cpassword ? "text" : "password"}
                id="cpassword"
                {...formik.getFieldProps("cpassword")}
                required
              ></input>
              <label
                className={`${styles.inputLabel} ${formik.values.cpassword && styles.inputActive} ${
                  formik.errors.cpassword && formik.touched.cpassword ? styles.errorLabel : null
                }`}
              >
                Confirm Password
              </label>
              {showPassword.cpassword ? (
                <FiEye
                  className={styles.inputIcons}
                  onClick={() => {
                    setShowPassword({ ...showPassword, cpassword: false });
                  }}
                />
              ) : (
                <FiEyeOff
                  className={styles.inputIcons}
                  onClick={() => {
                    setShowPassword({ ...showPassword, cpassword: true });
                  }}
                />
              )}
            </div>
            <AnimatePresence>
              {formik.errors.cpassword && formik.touched.cpassword && (
                <motion.span
                  className={styles.errorMessage}
                  key="errorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formik.errors.cpassword}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button type="submit" className={styles.submitBtn}>
            {"Submit"}
          </button>

          <div className={styles.loginOrSignUpPart}>
            {"Have an account? "}
            <Link href={"/login"} className={styles.toggleBtn}>
              {"Login"}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RegisterForm;
