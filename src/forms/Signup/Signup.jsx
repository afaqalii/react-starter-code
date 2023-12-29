// importing libraries
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// importing firebase
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { ref, set, update } from "firebase/database";
import { auth, db } from "../../firebase";
// importing components
import { signupValidation, signupInitialValues } from "./signupSchema";
import { setAuth } from "../../store/reducers/AuthSlice";

// importing assets and icons
import { RiEyeOffLine } from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";
import Spinner from "../../utils/Spinner";
import pinklogo from "../../assets/logos/pink-full-logo.png";
import "./index.css";
import { Helmet } from "react-helmet";

//
const Signup = () => {
  // local states
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);
  let location = useLocation();
  const { from } = location.state || {
    from: { pathname: `/dashboard/search-dashboard` },
  };
  // fieldss
  const [fields, setFields] = useState([
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      showPassword: false,
      placeholder: "Enter your password",
    },

  ]);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleTogglePassword = (index) => {
    let updatedPasswordArray = [...fields];
    updatedPasswordArray[index].showPassword =
      !updatedPasswordArray[index].showPassword;

    if (updatedPasswordArray[index].showPassword) {
      updatedPasswordArray[index].type = "text";
    } else {
      updatedPasswordArray[index].type = "password";
    }

    setFields(updatedPasswordArray);
  };


  // function to run when form is submitted
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Sign up with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        credit: 0,
        createdAt: new Date().toISOString(),
      };
      await set(ref(db, `users/${user.uid}`), userData).then(() => {
        dispatch(
          setAuth({
            isLoading: false,
            isAuthenticated: true,
            user: {userData, emailVerified: user?.emailVerified || false},
          })
        );
        navigate("/dashboard/search-dashboard");
      });
      await sendEmailVerification(user);
    } catch (error) {
      console.error(error);
      setFieldError("email", "Invalid email or email already in use"); // Display the error message
    } finally {
      setSubmitting(false);
    }
  };

  // JSX
  if (isLoading)
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <div className="mx-auto w-full max-w-[1250px] px-14 text-center">
          <Spinner />
        </div>
      </div>
    );
  // is user is authenticated it will be redirected to its respective portals/dashboards
  if (isAuthenticated) {
    return <Navigate to={from.pathname} replace />;
  }
  return (
    <div className="flex px-6 items-center justify-center py-4 min-h-screen">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      {/* <button onClick={sendDataToDatabase}>Send to DB</button> */}
      <Formik
        initialValues={signupInitialValues}
        validationSchema={signupValidation}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="max-[480px]:min-w-full w-[450px]  border-2 bg-white  border-[#d31e6f] max-w-[450px] my-14 shadow px-5 py-10 rounded-2xl">
            <div className="flex justify-center">
              <img src={pinklogo} alt="" className="max-w-[200px]" />
            </div>
            <h1 className="font-bold text-[40px]  mb-8 mt-8 text-center text-[#d31e6f]">
              Sign Up
            </h1>
            {fields.map((field) => (
              <div key={field.name} className="mt-2 mb-4">
                <label
                  htmlFor={field.name}
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  {field.label}
                </label>
                <Field
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  className="appearance-none border  rounded-[10px] w-full py-4 px-6 text-gray-primary leading-tight placeholder:text-gray-primary focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name={field.name}
                  component="div"
                  className="text-red-500 ml-2 text-xs mt-2"
                />
              </div>
            ))}
            <button
              type="submit"
              className={`w-full bg-[#d31e6f] text-white font-bold py-4 px-4 rounded-[50px] focus:outline-none focus:shadow-outline ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Sign Up"}
            </button>
            <p className="mt-3 text-xs text-pink">
              Already have an account ?
              <span className="font-bold pl-1 text-sm te xt-[#d31e6f]">
                <Link className="text-pink" to={"/login"}>
                  Log In
                </Link>
              </span>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;