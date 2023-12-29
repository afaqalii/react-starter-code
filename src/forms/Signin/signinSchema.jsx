import * as Yup from "yup";

export const loginInitialValues = {
  email: "",
  password: "", 
};

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });