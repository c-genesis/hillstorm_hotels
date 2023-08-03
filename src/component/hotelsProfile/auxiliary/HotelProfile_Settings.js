import React, { useEffect, useRef, useState } from "react";
import Loading from "../../loading/Loading";
import Auxiliary1 from "./Auxiliary1";
import VerticalScroll from "../../scroll/VerticalScroll";
import { Modal, Spinner } from "react-bootstrap";
import CustomErrorMsg from "../../errorMessage/CustomErrorMsg";
import { requestApi } from "../../apiRequests/requestApi";
import { CSSTransition } from 'react-transition-group'
import { ErrorMessage, Formik } from 'formik'
import * as yup from 'yup'

export default function HotelProfile_Settings({ user_HP, accessToken, setUser_HP }){
    const hotelProfileSettingsRef = useRef(null)

    const schema = yup.object({
        newPassword: yup.string().required('New password required'),
        confirmNewPassword: yup.string().required('New password confirmation required')
            .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    })

    const [passwordResetModal, setPasswordResetModal] = useState(false)
    const [oldPasswordInput, setOldPasswordInput] = useState()
    const [changeErrorMsg, setChangeErrorMsg] = useState({ changeType: null, error: null })
    const [apiFetchReqs, setApiFetchReqs] = useState()
    const [showEditPassword, setShowEditPassword] = useState(false)


    useEffect(() => {
        if(apiFetchReqs){
            passwordRequestApi({ reqs: apiFetchReqs })
        }
    }, [apiFetchReqs])

    const passwordRequestApi = async ({ reqs }) => {
        const { type, url, requestBody, method, token } = reqs
        const passwordRequest = await requestApi({ url, method, token, data: requestBody })
        const { responseStatus, result, errorMsg } = passwordRequest
        if(responseStatus){
            if(type == 'oldPassword'){
                setShowEditPassword(true)
            } else{
                showAlertModal()
            }
        } else{
            setChangeErrorMsg({ changeType: type, error: errorMsg.error })
        }

        setOldPasswordInput('')
        setApiFetchReqs()

        return;
    }

    const showAlertModal = () => {
        setUser_HP(prev => ({
            ...prev,
            newRoute: null, 
            newRoute_HP: null,
            alertModal: {message: 'password change successful'},
        }))        
        hidePasswordResetModal()
    }

    const showPasswordResetModal = () => {
        setPasswordResetModal(true)
        return reset()
    }
    const hidePasswordResetModal = () =>  setPasswordResetModal(false)
    
    const handleOldPasswordInputChange = e => {
        setChangeErrorMsg({ changeType: null, error: null })
        setOldPasswordInput(e.target.value)
    }

    const reset = () => {
        setChangeErrorMsg({ changeType: null, error: null })
        setOldPasswordInput()
        setApiFetchReqs()
        setShowEditPassword(false)
    }

    const initiatePasswordConfirmation = () => {
        if(!oldPasswordInput){
            return setChangeErrorMsg({ changeType: 'oldPassword', error: 'Cannot be empty!'})
        }

        return setApiFetchReqs({
            url: 'users/password-confirmation',
            method: 'put',
            token: accessToken,
            type: 'oldPassword',
            requestBody: {
                oldPassword: oldPasswordInput,
                user_id: user_HP.details.hotel_id
            }
        })
    }

    if(user_HP){

        const { details } = user_HP
        const { profileimg, phonenumber, hotelname, email, rating } = details

        return (
            <div className="pb-5">            
                <div style={{width: '100%'}} className="d-flex justify-content-between w-100">
                    <div className="col-lg-3">
                        <Auxiliary1 
                            img={profileimg}
                            titleHeader={'Settings'}
                            subHeader={hotelname}
                            phone={phonenumber}
                            email={email}
                            hideBtns={true}
                            rating={rating}
                        />
                    </div> 
                    <div className="col-lg-9 px-3">
                        <div className="mb-4 pb-0 mx-3 col-lg-3">
                            <h4 className="pb-2 hotel-profile-main-admin-profile-header bottom-border text-center">Account Settings</h4>
                        </div> 
                        <VerticalScroll defaultHeight={'60vh'}>
                            <div className="mx-3 py-4 my-1">
                                <div className="mb-4">
                                    <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Privacy</h6>                                    
                                </div>                                
                                <div className="mb-4">
                                    <p className="login-form-label mb-2">Password:</p>
                                    <p className="custom-placeholder">*****************</p>
                                </div> 
                                <button 
                                    onClick={showPasswordResetModal}
                                    className="login-form-btn p-3"
                                >
                                    Change Password
                                </button>                                                               
                            </div>
                        </VerticalScroll>                      
                    </div>
                </div>
                <Modal
                    show={passwordResetModal}
                    onHide={hidePasswordResetModal}     
                    // backdrop="static" 
                    // centered
                >
                    <Modal.Body className="m-0 p-0 my-3">
                        <div className="mb-4">
                            <div className="mb-4">
                                <h4 className="pb-2 hotel-profile-main-admin-profile-header bottom-border text-center hotel-profile-room-creation-active-nav">
                                    Password Reset
                                </h4>
                            </div>
                            <div className="mx-3">
                                <div className="mb-3">
                                    <p className="login-form-label">
                                        To change your password, you must first confirm your old password
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="oldPassword" className="login-form-label mb-2">Old Password</label>
                                    <br/>
                                    <input 
                                        name="oldPassword"
                                        placeholder="Your old password"
                                        className="login-form-input-field p-2 w-75"
                                        type="password"
                                        disabled={showEditPassword}
                                        onChange={handleOldPasswordInputChange}
                                        value={oldPasswordInput}
                                    />                                 
                                </div>                                
                                {
                                    <div className="w-75">
                                        {
                                            changeErrorMsg.changeType == 'oldPassword' &&
                                                <CustomErrorMsg noCenter={true} errorMsg={changeErrorMsg.error} />
                                        }
                                    </div>
                                }
                                <div className="mb-5">
                                    <button
                                        className="login-form-btn p-3"
                                        onClick={initiatePasswordConfirmation}
                                        disabled={(apiFetchReqs || showEditPassword) ? true : false}
                                        style={{
                                            opacity: (apiFetchReqs || showEditPassword) ? 0.76 : 1
                                        }}
                                    >
                                        {
                                            apiFetchReqs && !showEditPassword && <span><Spinner size="sm" className="mx-2" /></span>
                                        }
                                        {
                                            apiFetchReqs && !showEditPassword ? 'Confirming' : 'Confirm'
                                        }
                                    </button>
                                </div>
                                <CSSTransition                    
                                    in={showEditPassword}
                                    nodeRef={hotelProfileSettingsRef}
                                    timeout={500}
                                    classNames="alert"
                                    unmountOnExit
                                    // onEnter={() => setShowEditRoom(false)}
                                    // onExited={() => setShowEditRoom(true)}
                                >
                                    <div ref={hotelProfileSettingsRef}>
                                        <div className="mb-3">
                                            <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Password Reset</h6>                                    
                                        </div>                                        
                                        <div className="mb-3">
                                            <p className="login-form-label">
                                                Password confirmation successful. Please provide a new password
                                            </p>
                                        </div>
                                        {
                                            changeErrorMsg.changeType == 'newPassword' &&
                                                <CustomErrorMsg errorMsg={changeErrorMsg.error} />
                                        }                                        
                                        <Formik
                                            initialValues={{
                                                newPassword: '', confirmNewPassword: ''
                                            }}
                                            validationSchema={schema}
                                            onSubmit={(values) => {
                                                setApiFetchReqs({ 
                                                    requestBody: {
                                                        newPassword: values.newPassword,
                                                        user_id: user_HP.details.hotel_id
                                                    },
                                                    method: 'put',
                                                    url: 'users/password-reset',
                                                    token: accessToken,
                                                    type: 'newPassword'
                                                })
                                            }}
                                        >
                                            {({ values, isValid, dirty, handleBlur, handleChange, handleSubmit }) => (
                                                <div className="">
                                                    <div className="mb-3">
                                                        <label htmlFor="newPassword" className="login-form-label mb-2">New Password</label>
                                                        <br/>
                                                        <input 
                                                            name="newPassword"
                                                            placeholder="Set a new password"
                                                            className="login-form-input-field p-2 w-75"
                                                            type="password"
                                                            onInput={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.newPassword}
                                                        />
                                                        <p className="login-error-msg text-center w-75 my-2">
                                                            <ErrorMessage name="newPassword" />
                                                        </p>                              
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="confirmNewPassword" className="login-form-label mb-2">Confirm New Password</label>
                                                        <br/>
                                                        <input 
                                                            name="confirmNewPassword"
                                                            placeholder="Confirm new password"
                                                            className="login-form-input-field p-2 w-75"
                                                            type="password"
                                                            onInput={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.confirmNewPassword}
                                                        /> 
                                                        <p className="login-error-msg text-center w-75 my-2">
                                                            <ErrorMessage name="confirmNewPassword" />
                                                        </p>                                                                                        
                                                    </div>  
                                                    <div className="">
                                                        <button
                                                            onClick={handleSubmit}
                                                            className="login-form-btn p-3"
                                                            disabled={apiFetchReqs ? true : false}
                                                            style={{
                                                                opacity: apiFetchReqs ? 0.76 : 1
                                                            }}
                                                        >
                                                            {
                                                                apiFetchReqs && <span><Spinner size="sm" className="mx-2" /></span>
                                                            }
                                                            {
                                                                apiFetchReqs ? 'Resetting' : 'Reset Password'
                                                            }
                                                        </button>
                                                    </div>                                                                                                      
                                                </div>
                                            )}
                                        </Formik>
                                    </div>
                                </CSSTransition>                              
                            </div>
                        </div>  
                    </Modal.Body>
                </Modal>
            </div>       
        )
    } else{
        return <Loading  />
    }
}