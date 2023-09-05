import React, { useState, useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // Don't forget to import axios
import '../Home/style.css';
import { Link } from 'react-router-dom';
import PasswordChangePopup from '../Pop-Ups/PasswordChangePopup';

const NewPassword = () => {
  const [forgotVerificationToken, setForgotVerificationToken] = useState('');

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('yourTokenKey'); // Replace 'yourTokenKey' with the actual key you used to store the token
    if (tokenFromLocalStorage) {
      setForgotVerificationToken(tokenFromLocalStorage);
    }
  }, []);

  const initialValues = {
    password: '',
    ConfirmPassword: '',
  };

  const onSubmit = (values) => {

    

    // Prepare data for sending to the backend
    const dataToSend = {
    
    passwordVerificationCode:  localStorage.getItem("userToken"),
      password: values.password,
      email: "sudhalohani1@gmail.com"
     
    };
    
    // Send data to the backend

    axios
      .post('https://auth.purplemaze.co/api/v1/users/forgot-password-change', dataToSend) 
      .then((response) => {
        console.log('Password change successful:', response);
        localStorage.removeItem('userToken')
       
      })
      .catch((error) => {
        console.error('Password change failed:', error);
       
      });
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .required('New Password is required')
      .min(6, 'New Password must be at least 6 characters long'),
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  return (
    <div className="outer-container">
      <div className="container">
        <div className="centered-container">
          <div className="wrapper">
            <h2 className="text-center">Create New Password</h2>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {(formik) => (
                <Form>
                  <div className="form-group my-3">
                    <label>New Password</label>
                    <Field
                      type="password"
                      name="password"
                      className={
                        formik.touched.password && formik.errors.password
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                    />
                    <ErrorMessage name="password">
                      {(errorMessage) => (
                        <small className="text-danger">{errorMessage}</small>
                      )}
                    </ErrorMessage>
                  </div>
                  <PasswordChangePopup/>

                  <div className="form-group my-3">
                    <label>Confirm New Password</label>
                    <Field
                      type="password"
                      name="ConfirmPassword"
                      className={
                        formik.touched.ConfirmPassword &&
                        formik.errors.ConfirmPassword
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                    />
                    <ErrorMessage name="ConfirmPassword">
                      {(errorMessage) => (
                        <small className="text-danger">{errorMessage}</small>
                      )}
                    </ErrorMessage>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block w-100 circular-button"
                  >
                    Reset Password
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
