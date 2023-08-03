import React, { useEffect, useState, useRef } from "react";
import * as yup from 'yup'
import { Formik, ErrorMessage, Form, Field } from 'formik'
import loginImg1 from '../../images/loginpage/loginImg1.jpg'
import loginImg2 from '../../images/loginpage/loginImg2.jpg'
import loginImg3 from '../../images/loginpage/loginImg3.jpg'
import loginImg4 from '../../images/loginpage/loginImg4.jpg'
import logo from '../../images/logos/LogoBlock.svg'
import { Carousel, Spinner, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { requestApi } from "../apiRequests/requestApi";
import CustomErrorMsg from "../errorMessage/CustomErrorMsg";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

import './css/auth.css'
import ScrollToTop from "../scroll/ScrollToTop";




const images = [
        {img: loginImg1, alt: 'first slide'}, 
        {img: loginImg2, alt: 'second slide'}, 
        {img: loginImg3, alt: 'third slide'},
        {img: loginImg4, alt: 'fourth slide'
    }
]




export default function Login({ navigateTo, setUser }){
    const goToSignUp = () => navigateTo('/sign-up')

    const [loginRequirements, setLoginRequirements] = useState()
    const [errorMsg, setErrorMsg] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)

    useEffect(() => {
        if(loginRequirements){
            loginUser({ requestBody: loginRequirements })
        }
    }, [loginRequirements])

    const loginUser = async ({ requestBody }) => {        
        const { usertype } = requestBody

        const url = usertype == 'hotel' ? 'users/hotels/login' : 'users/customers/login'
        const newRoute = usertype == 'hotel' ? 'hotel/profile' : '/'

        const userLogin = await requestApi({ url, method: 'post', data: requestBody })
        const { result, responseStatus, errorMsg } = userLogin
        if(responseStatus){            
            const { data } = result
            const { accessToken } = data
            const localStorageIdValue = usertype == 'hotel' ? data.hotel_id : data.customer_id

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('id', localStorageIdValue)
            localStorage.setItem('usertype', usertype)

            setUser({ details: {...data, usertype}, newRoute})
        } else{
            setLoginRequirements('')
            setErrorMsg(errorMsg.error ? errorMsg.error : 'Error logging in. try changing usertype')
        }
    }

    const schema = yup.object({
        email: yup.string().email('Must be a valid email address!').required('Email address is required'),
        password: yup.string().required('Password required'),
        usertype: yup.string().required('Usertype is required'),
    })

    const carouselItems = images.map((image, i) => {
        const { img, alt } = image
        return (
            <Carousel.Item key={i}>
                <img
                    className="login-image"
                    src={img}
                    alt="First slide"
                />
            </Carousel.Item>
        )
    })

    return (
        <div>      
            <ScrollToTop condition={errorMsg} />      
            <Formik
                initialValues={{
                    email: '', password: '', usertype: ''
                }}
                onSubmit={(values, { resetForm }) => {
                    setLoginRequirements(values)
                    setErrorMsg('')
                }}
                validationSchema={schema}
            >
                {({ handleBlur, handleChange, handleSubmit, isValid, dirty, values}) => (
                    <Form>
                        <div className="login-container">
                            <div className="d-flex">
                                <div className="col-lg-6">
                                    <Carousel 
                                        fade 
                                        interval={2200}
                                        controls={false}
                                    >
                                        { carouselItems }                                                                                                                                                                
                                    </Carousel>                                   
                                </div>

                                <div className="col-lg-6 p-5 bg-white">
                                    <div className="my-5"></div>
                                    <div className="mb-5">
                                        <div className="mb-5">
                                            <div className="mb-5">
                                                <img src={logo} />
                                            </div>
                                            <div>
                                                <h1 className="login-form-header mb-4">Login</h1>
                                                <p className="login-form-caption">
                                                    Login with the data you entered during your registration.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            {
                                                errorMsg && <CustomErrorMsg errorMsg={errorMsg} />
                                            }                                            
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
                                            <div className="mb-4">
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
                                                onClick={handleSubmit}
                                                type="submit"
                                                className="login-form-btn w-100 p-3"
                                            >
                                                {
                                                    loginRequirements &&
                                                        <span><Spinner size="sm" className="mx-2" /></span>                                                   
                                                }                                                
                                                {
                                                    loginRequirements ? 'Logging in...' : 'Log In'
                                                }
                                            </button>
                                        </div>

                                        <div className="d-flex justify-content-end align-items-center">
                                            <p className="login-form-forgot-password">Did you forget your password?</p>
                                        </div>
                                    </div>

                                    <div className="login-signup-container p-5 mb-5">
                                        <div className="mb-4">
                                            <h2 className="login-signup-header mb-4">Are you new here?</h2>
                                            <p className="login-form-caption">
                                                Create a new account to utilize our services                                         
                                            </p>
                                        </div> 
                                        <div>
                                            <button 
                                                className="login-signup-btn w-100 p-3"
                                                onClick={goToSignUp}
                                            >
                                                Create account
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