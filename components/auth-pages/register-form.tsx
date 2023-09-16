import { useUserInfoContext } from "@/context/user-context";
import { registerValidate } from "@/lib/auth/user-validation/client";
import { RegisterValues } from "@/lib/types/form-authentication";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { MdAlternateEmail } from "react-icons/md";

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
    <section className={"authFormSectionBox"}>
      <div className={"authFormBoxRegister"}>
        <h1>Create a New Account</h1>

        <form className={"authForm"} onSubmit={handleSubmit}>
          <div className={"authInputBox"}>
            <div className={"authInputBox2"}>
              <input
                className={`${"authTextInput"} ${
                  !errors.name && touched.name && "authSuccessOutline"
                } ${errors.name && touched.name && "authErrorOutline"}`}
                type="text"
                id="name"
                {...getFieldProps("name")}
                required
              ></input>

              <label
                className={`${"authInputLabel"} ${
                  !errors.name && touched.name && "authSuccessLabel"
                } ${errors.name && touched.name && "authErrorLabel"}`}
              >
                Username
              </label>

              <FiUser className={"authInputIcons"} />
            </div>
            <AnimatePresence>
              {errors.name && touched.name && (
                <motion.span
                  className={"authErrorMessage"}
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

          <div className={"authInputBox"}>
            <div className={"authInputBox2"}>
              <input
                className={`${"authTextInput"} ${
                  !errors.email && touched.email && "authSuccessOutline"
                } ${errors.email && touched.email && "authErrorOutline"}`}
                type="email"
                id="email"
                {...getFieldProps("email")}
                required
              ></input>
              <label
                className={`${"authInputLabel"} ${
                  !errors.email && touched.email && "authSuccessLabel"
                } ${errors.email && touched.email && "authErrorLabel"}`}
              >
                Email
              </label>
              <MdAlternateEmail className={"authInputIcons"} />
            </div>
            <AnimatePresence>
              {errors.email && touched.email && (
                <motion.span
                  className={"authErrorMessage"}
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

          <div className={"authInputBox"}>
            <div className={"authInputBox2"}>
              <input
                className={`${"authTextInput"} ${
                  !errors.password && touched.password && "authSuccessOutline"
                } ${errors.password && touched.password && "authErrorOutline"}`}
                type={showPassword.password ? "text" : "password"}
                id="password"
                {...getFieldProps("password")}
                required
              ></input>
              <label
                className={`${"authInputLabel"} ${
                  !errors.password && touched.password && "authSuccessLabel"
                } ${errors.password && touched.password && "authErrorLabel"}`}
              >
                Password
              </label>
              {showPassword.password ? (
                <FiEye
                  className={"authInputIcons"}
                  onClick={() => {
                    setShowPassword({ ...showPassword, password: false });
                  }}
                />
              ) : (
                <FiEyeOff
                  className={"authInputIcons"}
                  onClick={() => {
                    setShowPassword({ ...showPassword, password: true });
                  }}
                />
              )}
            </div>
            <AnimatePresence>
              {errors.password && touched.password && (
                <motion.span
                  className={"authErrorMessage"}
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

          <div className={"authInputBox"}>
            <div className={"authInputBox2"}>
              <input
                className={`${"authTextInput"} ${
                  !errors.cpassword && touched.cpassword && "authSuccessOutline"
                } ${errors.cpassword && touched.cpassword && "authErrorOutline"}`}
                type={showPassword.cpassword ? "text" : "password"}
                id="cpassword"
                {...getFieldProps("cpassword")}
                required
              ></input>
              <label
                className={`${"authInputLabel"} ${
                  !errors.cpassword && touched.cpassword && "authSuccessLabel"
                } ${errors.cpassword && touched.cpassword && "authErrorLabel"}`}
              >
                Confirm Password
              </label>
              {showPassword.cpassword ? (
                <FiEye
                  className={"authInputIcons"}
                  onClick={() => {
                    setShowPassword({ ...showPassword, cpassword: false });
                  }}
                />
              ) : (
                <FiEyeOff
                  className={"authInputIcons"}
                  onClick={() => {
                    setShowPassword({ ...showPassword, cpassword: true });
                  }}
                />
              )}
            </div>
            <AnimatePresence>
              {errors.cpassword && touched.cpassword && (
                <motion.span
                  className={"authErrorMessage"}
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

          <button type="submit" className={"authSubmitBtn"}>
            {"Submit"}
          </button>

          <div className={"authLoginOrSignUpBox"}>
            {"Have an account? "}
            <Link href={"/login"} className={"authLoginOrSignUpBtn"}>
              {"Login"}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RegisterForm;
