import React, {  useState } from "react";
import * as yup from 'yup'
import { Formik, ErrorMessage, Form, Field } from 'formik'
import logo from '../../images/logos/LogoBlock.svg'
import './css/auth.css'
import {  FormControl, InputGroup } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import AuthCarousel from "./auxiliary/AuthCarousel";
import "yup-phone";
import { PHONE_REG_EXP } from "../globals/globals";




export default function SignUp({ navigateTo }){
    const goToLogin = () => navigateTo('/login')

    const [passwordVisible, setPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)

    const schema = yup.object({
        email: yup.string().email('Must be a valid email address!').required('Email address is required'),
        password: yup.string().required('Password is required'),
        name: yup.string().required('Username is required'),
        usertype: yup.string().required('Usertype is required'),
        phonenumber: yup.string().matches(PHONE_REG_EXP, 'Invalid phone number').required('Phone number is required')
    })

    return (
        <div className="signup-page">            
            <Formik
                initialValues={{
                    email: '', password: '', name: '', usertype: '', phonenumber: ''
                }}
                onSubmit={(values, { resetForm }) => {
                    const entirePage = document.querySelector('.signup-page')
                    if(entirePage){
                        const { email, password, name, usertype, phonenumber } = values
                        const key = usertype.toLowerCase() == 'customer' ? 'username' : 'hotelname'
                        const userDetails = {
                            email, password, usertype, [key]: name, phonenumber
                        }                        

                        if(usertype == 'customer'){
                            navigateTo('/register-customer-profile', { userDetails })
                        }

                        if(usertype == 'hotel'){
                            navigateTo('/register-hotel-profile', { userDetails })
                        }


                        return entirePage.classList.add('disable-all-click-events')
                    }

                    return;
                }}
                validationSchema={schema}
            >
                {({ handleBlur, handleChange, handleSubmit, isValid, dirty, values}) => (
                    <Form>
                        <div className="login-container bg-white">
                            <div className="d-flex align-items-center">
                                <div className="col-lg-6">
                                    <AuthCarousel />                                  
                                </div>

                                <div className="col-lg-6 px-5 bg-white">
                                    {/* <div className="my-5"></div> */}
                                    <div className="mb-5">
                                        <div className="mb-5">
                                            <div className="mb-5">
                                                <img src={logo} />
                                            </div>
                                            <div>
                                                <h1 className="login-form-header mb-4">Create account</h1>
                                                <p className="login-form-caption">
                                                    Register to start using our services
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="mb-4">
                                                <label htmlFor="name" className="login-form-label mb-2">Username/Hotel Name</label>
                                                <br/>
                                                <input 
                                                    value={values.name}
                                                    name="name"
                                                    placeholder="username/hotel name"
                                                    onInput={handleChange}
                                                    onBlur={handleBlur}
                                                    className="login-form-input-field p-2 w-100"
                                                    type="text"
                                                />
                                                <p className="login-error-msg text-center my-2">
                                                    <ErrorMessage name="name" />
                                                </p>
                                            </div>                                            
                                            <div className="mb-4">
                                                <label htmlFor="email" className="login-form-label mb-2">Email</label>
                                                <br/>
                                                <input 
                                                    value={values.email}
                                                    name="email"
                                                    placeholder="yourname@example.com"
                                                    onInput={handleChange}
                                                    onBlur={handleBlur}
                                                    className="login-form-input-field p-2 w-100"
                                                    type="text"
                                                />
                                                <p className="login-error-msg text-center my-2">
                                                    <ErrorMessage name="email" />
                                                </p>                                                                                               
                                            </div>
                                            <div>
                                                <label htmlFor="password" className="login-form-label mb-2">Password</label>
                                                <br/>
                                                <InputGroup className="mb-3">
                                                    <FormControl
                                                        id="login-form-input-field-password"
                                                        name="password"
                                                        placeholder="password"
                                                        aria-label="password"
                                                        aria-describedby="password"
                                                        className="login-form-input-field"
                                                        value={values.password}
                                                        onInput={handleChange}
                                                        onBlur={handleBlur}
                                                        type={passwordVisible ? 'text' : 'password'}
                                                    />
                                                    <InputGroup.Text id="password" className="login-form-forgot-password" onClick={togglePasswordVisibility}>
                                                        {
                                                            passwordVisible
                                                            ?
                                                                <AiFillEye size={20} />
                                                            :
                                                                <AiFillEyeInvisible size={20} />    
                                                        }
                                                    </InputGroup.Text>
                                                </InputGroup>                                                
                                                <p className="login-error-msg text-center my-2">
                                                    <ErrorMessage name="password" />
                                                </p>                                                
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="phonenumber" className="login-form-label mb-2">Phone Number</label>
                                                <br/>
                                                <input 
                                                    value={values.phonenumber}
                                                    name="phonenumber"
                                                    placeholder="phone number"
                                                    onInput={handleChange}
                                                    onBlur={handleBlur}
                                                    className="login-form-input-field p-2 w-100"
                                                    type="text"
                                                />
                                                <p className="login-error-msg text-center my-2">
                                                    <ErrorMessage name="phonenumber" />
                                                </p>                                                                                               
                                            </div>                                            
                                            <div className="mb-4">
                                                <label htmlFor="usertype" className="login-form-label mb-2">Usertype</label>
                                                <br/>
                                                <div className="d-flex" role="group">                    
                                                    <div className="">
                                                        <label for="customer" className="login-form-label">
                                                            <Field 
                                                                type="radio" 
                                                                name="usertype" 
                                                                value="customer"
                                                                className="mx-2"
                                                                style={{accentColor: '#FFB901'}}
                                                            />
                                                            Customer
                                                        </label>
                                                    </div>
                                                    <div className="mx-3">
                                                        <label for="customer" className="login-form-label">
                                                            <Field 
                                                                type="radio" 
                                                                name="usertype" 
                                                                value="hotel"
                                                                className="mx-2"
                                                                style={{accentColor: '#FFB901'}}
                                                            />
                                                            Hotel
                                                        </label>                                                                                                               
                                                    </div> 
                                                </div>           
                                                <p className="login-error-msg text-center my-2">
                                                    <ErrorMessage name="usertype" />
                                                </p>                                                                                               
                                            </div>                                                                                                                        
                                        </div>

                                    <div className="mb-3">
                                        <button 
                                            disabled={!(isValid && dirty)}
                                            style={{
                                                opacity: !(isValid && dirty) ? 0.76 : 1
                                            }}
                                            className="login-form-btn w-100 p-3"
                                            onClick={handleSubmit}
                                        >
                                            Begin registration                                                
                                        </button>
                                    </div>
                                    </div>                                    

                                    <div className="login-signup-container p-5 mb-5">
                                        <div className="mb-4">
                                            <h2 className="login-signup-header mb-4">Already have an account?</h2>
                                            <p className="login-form-caption">
                                                Login with the data you entered during your registration.                                          
                                            </p>
                                        </div> 
                                        <div>
                                            <button 
                                                className="login-signup-btn w-100 p-3"
                                                type='button'
                                                onClick={goToLogin}                                            
                                            >
                                                Go to login
                                            </button>
                                        </div>                                       
                                    </div>

                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="d-flex">
                                            <p className="login-signup-btn-footer-text">Cookies</p>
                                            <p className="mx-lg-4 login-signup-btn-footer-text">Legal policy</p>
                                        </div>
                                        <div>
                                            <p className="fst-italic login-signup-btn-footer-text">Made by Control Genesis</p>
                                        </div>
                                        <div>
                                            <p className="login-signup-btn-footer-text">Copyright 2021</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}