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
  const { values, errors, touched, handleSubmit, getFieldProps } = formik;

  async function SignUpFormSubmitHandler(values: RegisterValues) {
    registerUser(values);
  }
  return (
    <section className={styles.formBox}>
      <div className={styles.formOuterRegister}>
        <h1>Create a New Account</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <div className={styles.inputBox2}>
              <input
                className={`${styles.textInput} ${
                  !errors.name && touched.name && styles.successOutline
                } ${errors.name && touched.name && styles.errorOutline}`}
                type="text"
                id="name"
                {...getFieldProps("name")}
                required
              ></input>

              <label
                className={`${styles.inputLabel} ${
                  !errors.name && touched.name && styles.successLabel
                } ${errors.name && touched.name && styles.errorLabel}`}
              >
                Username
              </label>

              <FiUser className={styles.inputIcons} />
            </div>
            <AnimatePresence>
              {errors.name && touched.name && (
                <motion.span
                  className={styles.errorMessage}
                  key="errorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.inputBox}>
            <div className={styles.inputBox2}>
              <input
                className={`${styles.textInput} ${
                  !errors.email && touched.email && styles.successOutline
                } ${errors.email && touched.email && styles.errorOutline}`}
                type="email"
                id="email"
                {...getFieldProps("email")}
                required
              ></input>
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
                type={showPassword.password ? "text" : "password"}
                id="password"
                {...getFieldProps("password")}
                required
              ></input>
              <label
                className={`${styles.inputLabel} ${
                  !errors.password && touched.password && styles.successLabel
                } ${errors.password && touched.password && styles.errorLabel}`}
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

          <div className={styles.inputBox}>
            <div className={styles.inputBox2}>
              <input
                className={`${styles.textInput} ${
                  !errors.cpassword && touched.cpassword && styles.successOutline
                } ${errors.cpassword && touched.cpassword && styles.errorOutline}`}
                type={showPassword.cpassword ? "text" : "password"}
                id="cpassword"
                {...getFieldProps("cpassword")}
                required
              ></input>
              <label
                className={`${styles.inputLabel} ${
                  !errors.cpassword && touched.cpassword && styles.successLabel
                } ${errors.cpassword && touched.cpassword && styles.errorLabel}`}
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
              {errors.cpassword && touched.cpassword && (
                <motion.span
                  className={styles.errorMessage}
                  key="errorMessage"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.cpassword}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button type="submit" className={styles.submitBtn}>
            {"Submit"}
          </button>

          <div className={styles.loginOrSignUpBox}>
            {"Have an account? "}
            <Link href={"/login"} className={styles.loginOrSignUpBtn}>
              {"Login"}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RegisterForm;
