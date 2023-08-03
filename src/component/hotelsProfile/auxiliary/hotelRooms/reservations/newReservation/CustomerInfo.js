import React, {  useEffect, useRef, useState } from "react";
import * as yup from 'yup'
import { Formik, ErrorMessage, Form, Field } from 'formik'
import { BsArrowRight } from 'react-icons/bs'
import "yup-phone";
import { EMAIL_REG_EXP, PHONE_REG_EXP } from "../../../../../globals/globals";
import { CSSTransition } from "react-transition-group";
import { Spinner } from "react-bootstrap";
import CustomErrorMsg from "../../../../../errorMessage/CustomErrorMsg";
import { requestApi } from "../../../../../apiRequests/requestApi";
import Auxiliary1 from "../../../Auxiliary1";




export default function CustomerInfo({ navigateTo, setCustomerDetails, accessToken }){
    const showOnlyMailRef = useRef(null)

    const schema = yup.object({
        email: yup.string().email('Must be a valid email address!').required('Email address is required'),
        name: yup.string().required('Username is required'),
        phonenumber: yup.string().matches(PHONE_REG_EXP, 'Invalid phone number').required('Phone number is required'),
        profileimg: yup.string().required('Profile Img is required'),
    })

    const [showForm, setShowForm] = useState(true)
    const [showOnlyMail, setShowOnlyMail] = useState(false)
    const [customer, setCustomer] = useState()
    const [customerReqs, setCustomerReqs] = useState({ isLoading: false, data: null, errorMsg: null })
    const [emailInput, setEmailInput] = useState()


    useEffect(() => {
        if(customerReqs.data){
            customerRequest({ reqs: customerReqs.data })
        }
    }, [customerReqs])

    const updateCustomerDetails = () => customer && setCustomerDetails(customer) 

    const handleEmailInput = e => {
        if(e){
            setEmailInput(e.target.value)
            setCustomerReqs({ errorMsg: null, data: null, isLoading: false })
        }
    }

    const customerRequest = async ({ reqs }) => {
        // const { data, method, url, accessToken } = reqs
        const requestedCustomer = await requestApi(reqs)
        const { responseStatus, result, errorMsg } = requestedCustomer
        if(responseStatus){
            const { data } = result
            setCustomer(data)
            setCustomerReqs({ isLoading: false, data: null, errorMsg: null })
        } else{
            setCustomerReqs({ isLoading: false, data: null, errorMsg: errorMsg.error })
        }

        return
    }

    const goToForm = () => {
        setShowOnlyMail(false)
        return reset()
    }
    const goToOnlyMail = () => {
        setShowOnlyMail(true)
        setEmailInput('')
        return reset()
    }

    const reset = () => {
        setCustomerReqs({ isLoading: false, data: null, errorMsg: null })
        setCustomer()
        setEmailInput('')
        
        return
    }

    const retrieveCustomer = () => {
        setCustomer()

        if(!emailInput){
            return setCustomerReqs({
                isLoading: false, data: null,
                errorMsg: 'Existing email required'
            })
        }

        if(!emailInput.match(EMAIL_REG_EXP)){
            return setCustomerReqs({
                isLoading: false, data: null,
                errorMsg: 'Invalid email format'
            })            
        }

        if(emailInput){
            return setCustomerReqs({ 
                isLoading: true, errorMsg: null,
                data: {
                    method: 'get',
                    url: `users/hotels/retrieve-single-customer/${emailInput}`,
                    data: null,
                    token: accessToken
                }
            })
        }

        return setCustomerReqs({
            isLoading: false, data: null,
            errorMsg: 'Service error! Cannot retrieve customer at this time, try again later'
        })
    }

    return (
        <div className="signup-page">  
            {
                showForm &&          
                    <Formik
                        initialValues={{
                            email: '', name: '', phonenumber: '', profileimg: ''
                        }}
                        onSubmit={(values, { resetForm }) => {
                            const entirePage = document.querySelector('.signup-page')
                            if(entirePage){
                                const { email, name, phonenumber, profileimg } = values
                                const userDetails = {
                                    email, 
                                    password: '#_customer_dummy_account_#', 
                                    usertype: 'customer',
                                    username: name, 
                                    phonenumber,
                                    activated: true,
                                    profileimg,
                                    activatetoken: '123098'
                                }                        

                                setCustomerDetails(userDetails)

                                return entirePage.classList.add('disable-all-click-events')
                            }

                            return;
                        }}
                        validationSchema={schema}
                    >
                        {({ handleBlur, handleChange, handleSubmit, isValid, dirty, values}) => (
                            <Form>
                                <div className="login-container bg-white">
                                    <div className="mb-4 d-flex justify-content-between align-items-center">
                                        <h6 className="single-hotel-filter-rooms-label-text m-0 p-0 left-border px-3">
                                            Create customer
                                        </h6>
                                        <h6 
                                            onClick={goToOnlyMail}
                                            style={{
                                                textDecoration: 'underline'
                                            }} 
                                            className="p-0 m-0 custom-placeholder clickable"
                                        >
                                            Already have account?
                                        </h6>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="profileimg" className="login-form-label mb-2">Profile</label>
                                        <br/>
                                        <div className="d-flex justify-content-center">
                                            <div className="d-flex" role="group">     
                                                <div className="mx-3">
                                                    <img 
                                                        src="https://res.cloudinary.com/dqcmfizfd/image/upload/v1690995948/maleProfile_zworih.jpg"
                                                        className="rounded-circle" 
                                                    />
                                                    <div className="">                                        
                                                        <label for="profileimg" className="login-form-label">
                                                            <Field 
                                                                type="radio" 
                                                                name="profileimg" 
                                                                value="https://res.cloudinary.com/dqcmfizfd/image/upload/v1690995948/maleProfile_zworih.jpg"
                                                                className="mx-2"
                                                                style={{accentColor: '#FFB901'}}
                                                            />
                                                            M
                                                        </label>
                                                    </div>                                    
                                                </div>                                               
                                                <div className="mx-3">
                                                    <img 
                                                        src="https://res.cloudinary.com/dqcmfizfd/image/upload/v1690996654/fb7efebf-5c08-4522-a5b4-bb8098a3ed26_ux2w3q.jpg"
                                                        className="rounded-circle" 
                                                    />  
                                                    <div>
                                                        <label for="profileimg" className="login-form-label">
                                                            <Field 
                                                                type="radio" 
                                                                name="profileimg" 
                                                                value="https://res.cloudinary.com/dqcmfizfd/image/upload/v1690996654/fb7efebf-5c08-4522-a5b4-bb8098a3ed26_ux2w3q.jpg"
                                                                className="mx-2"
                                                                style={{accentColor: '#FFB901'}}
                                                            />
                                                            F
                                                        </label>                                        
                                                    </div>                                                                                                                                                     
                                                </div> 
                                            </div>           
                                        </div>                                
                                        <p className="login-error-msg text-center my-2">
                                            <ErrorMessage name="profile" />
                                        </p>                                                                                               
                                    </div>                            
                                    <div className="mb-4">
                                        <div className="mb-4">
                                            <label htmlFor="name" className="login-form-label mb-2">username</label>
                                            <br/>
                                            <input 
                                                value={values.name}
                                                name="name"
                                                placeholder="username"
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
                                            <label htmlFor="email" className="login-form-label mb-2">email</label>
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
                                            <label htmlFor="password" className="login-form-label mb-2">Default password</label>
                                            <br/>
                                            <p className="custom-placeholder p-0 m-0">
                                                <span>#_customer_dummy_account_#</span>
                                            </p>                                         
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="phonenumber" className="login-form-label mb-2">phone number</label>
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
                                    </div>

                                    <div className="mb-3">
                                        <button 
                                            disabled={!(isValid && dirty)}
                                            style={{
                                                opacity: !(isValid && dirty) ? 0.76 : 1
                                            }}
                                            className="login-form-btn p-3"
                                            onClick={handleSubmit}
                                        >
                                            Continue
                                            <span className="mx-2">
                                                <BsArrowRight size={20} />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
            }

            <CSSTransition                    
                in={showOnlyMail}
                nodeRef={showOnlyMailRef}
                timeout={500}
                classNames="alert"
                unmountOnExit
                onEnter={() => setShowForm(false)}
                onExited={() => setShowForm(true)}
            >
                <div ref={showOnlyMailRef}>
                    <div className="mb-4">
                        <div className="mb-4 d-flex justify-content-between align-items-center">
                            <h6 className="single-hotel-filter-rooms-label-text m-0 p-0 left-border px-3">
                                Retrieve customer
                            </h6>
                            <h6 
                                onClick={goToForm}
                                style={{
                                    textDecoration: 'underline'
                                }} 
                                className="p-0 m-0 custom-placeholder clickable"
                            >
                                Create customer?
                            </h6>
                        </div>
                        {
                            customerReqs.errorMsg && <CustomErrorMsg errorMsg={customerReqs.errorMsg} />
                        }                        
                        <div className="mb-4">
                            <label htmlFor="existingemail" className="login-form-label mb-2">Provide existing customer's email address</label>
                            <br/>
                            <input 
                                name="existingemail"
                                placeholder="existingmail@example.com"
                                className="login-form-input-field p-2 w-100"
                                type="text"
                                onChange={handleEmailInput}
                                value={emailInput}
                            />                                                                                           
                        </div>  
                        <div>
                            <button
                                onClick={retrieveCustomer}
                                className="login-form-btn p-3"
                                disabled={customerReqs.isLoading ? true : false}
                                style={{
                                    opacity: customerReqs.isLoading ? 0.76 : 1
                                }}
                            >
                                <span>
                                    { customerReqs.isLoading && <Spinner size="sm" className="mx-2" /> }
                                </span>                                
                                <span>
                                    { customerReqs.isLoading ? 'Retrieving' : 'Retrieve' }
                                </span>
                            </button>
                        </div>                      
                    </div>  

                    {
                        customer &&
                            <div>
                                <div className="d-flex justify-content-center mb-3">
                                    <div className='col-lg-7'>
                                        <Auxiliary1 
                                            img={customer.profileimg}
                                            titleHeader={customer.username}
                                            subHeader={'retrieved successful'}
                                            phone={customer.phonenumber}
                                            email={customer.email}                                    
                                            isActive={true}          
                                            showArrow={true}
                                            show={true}
                                            showText={'Continue'}
                                            toggleFunc1={updateCustomerDetails}
                                        />
                                    </div>
                                </div>
                            </div>
                    }                  
                </div>
            </CSSTransition>
        </div>
    )
}