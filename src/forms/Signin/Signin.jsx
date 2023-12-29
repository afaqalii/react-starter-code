// importing libraries
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import pinklogo from "../../assets/logos/pink-full-logo.png";
// importing firebase
import { signInWithEmailAndPassword } from "firebase/auth";

// importing components
import { loginInitialValues, loginValidationSchema } from "./signinSchema";
import { auth, db } from "../../firebase";
import Spinner from "../../utils/Spinner";
import { setAuth } from "../../store/reducers/AuthSlice";
import { get, ref } from "firebase/database";
import { Helmet } from "react-helmet";

const Signin = () => {
  // states for this component
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);
  let location = useLocation();

  const { from } = location.state || {
    from: { pathname: `/dashboard/search-dashboard` },
  };

  // function to run when form is submitted
  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true)
    signInWithEmailAndPassword(auth, values.email, values.password
    ).then((userCredential) => {
      const user = userCredential.user;
      get(ref(db, `/users/${user.uid}`)).then((snap) => {
        if (snap.exists()) {
          dispatch(
            setAuth({
              isLoading: false,
              isAuthenticated: true,
              user: {...snap.val(), emailVerified: user.emailVerified || false},
            })
          );
          navigate("/dashboard/search-dashboard");
          setSubmitting(false);
        } else {
          toast.error("No such records found with this email!");
          setSubmitting(false);
        }
      }).catch((err) => {
        console.log(err)
        toast.error("Something went wrong!");
        setSubmitting(false);
      })
    }).catch((e) => {
      console.log("error => ", e.code);
      switch (e.code) {
        case "auth/invalid-login-credentials":
          toast.error("No such user is available, Invalid login details");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format");
          break;
        case "auth/wrong-password":
          toast.error("Email or password is incorrect");
          break;
        case "auth/user-not-found":
          toast.error("User not found.");
          break;
        default:
          toast.error("Something went wrong!");
      }
      setSubmitting(false);
    })
  }

  const fields = [
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
      placeholder: "Enter your password",
    },
  ];

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
    <div className="flex items-center justify-center px-6 py-8 min-h-screen">
      <Helmet>
        <title>Log In</title>
      </Helmet>
      <Formik
        initialValues={loginInitialValues}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="max-[480px]:min-w-full w-[450px] max-w-[450px] bg-white border-2 border-[#d31e6f] my-14 shadow px-5 py-10 rounded-2xl">
            <div className="flex justify-center">
              <img src={pinklogo} alt="" className="max-w-[200px]" />
            </div>
            <h1 className="font-bold text-[40px]  mb-8 mt-8 text-center text-[#d31e6f]">
              Log In
            </h1>
            {fields?.map((field, ind) => (
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
            <p className="mb-4 text-right text-[15px] text-pink">
              <Link to={"/forgot-password"}>Forgot password?</Link>
            </p>
            <button
              type="submit"
              className={`w-full bg-[#d31e6f] rounded-[50px] text-white font-bold py-4 px-4 focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Log In"}
            </button>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="mt-3 text-[15px] text-gray-700">
                Don&apos;t have an account ?
                <span className="font-bold pl-1 text-[#d31e6f] text-sm text-red-primary">
                  <Link to={"/signup"}>Sign up</Link>
                </span>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signin;