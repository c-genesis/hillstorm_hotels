import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import CustomErrorMsg from "../../errorMessage/CustomErrorMsg";
import { ErrorMessage, Formik } from "formik";
import * as yup from 'yup'
import { CSSTransition } from "react-transition-group";




export default function ResetPassword({ 
    passwordResetModal, hidePasswordResetModal, showEditPassword, specificErrorMsg,
    handleOldPasswordInputChange, editUserReqs, userProfileSettingsRef, user_id, setEditUserReqs,
    initiatePasswordConfirmation, setEditProfileReqs, oldPasswordInput, setSpecificErrorMsg
}){

    const schema = yup.object({
        newPassword: yup.string().required('New password required'),
        confirmNewPassword: yup.string().required('New password confirmation required')
            .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    })

    return (
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
                                value={oldPasswordInput}
                                disabled={showEditPassword}
                                onChange={handleOldPasswordInputChange}
                            />                                 
                        </div>                                
                        {
                            <div className="w-75">
                                {
                                    specificErrorMsg.changeType == 'oldPassword' &&
                                        <CustomErrorMsg noCenter={true} errorMsg={specificErrorMsg.errorMsg} />
                                }
                            </div>
                        }
                        <div className="mb-5">
                            <button
                                className="login-form-btn p-3"
                                onClick={initiatePasswordConfirmation}
                                disabled={(editUserReqs.changeType == 'newPassword' || showEditPassword) ? true : false}
                                style={{
                                    opacity: (editUserReqs.changeType == 'newPassword' || showEditPassword) ? 0.76 : 1
                                }}
                            >
                                {
                                    editUserReqs.changeType == 'newPassword' && !showEditPassword && <span><Spinner size="sm" className="mx-2" /></span>
                                }
                                {
                                    editUserReqs.changeType == 'newPassword' && !showEditPassword ? 'Confirming' : 'Confirm'
                                }
                            </button>
                        </div>
                        <CSSTransition                    
                            in={showEditPassword}
                            nodeRef={userProfileSettingsRef}
                            timeout={500}
                            classNames="alert"
                            unmountOnExit
                            // onEnter={() => setShowEditRoom(false)}
                            // onExited={() => setShowEditRoom(true)}
                        >
                            <div ref={userProfileSettingsRef}>
                                <div className="mb-3">
                                    <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Password Reset</h6>                                    
                                </div>                                        
                                <div className="mb-3">
                                    <p className="login-form-label">
                                        Password confirmation successful. Please provide a new password
                                    </p>
                                </div>
                                {
                                    specificErrorMsg.changeType == 'newPassword' &&
                                        <CustomErrorMsg errorMsg={specificErrorMsg.errorMsg} />
                                }                                        
                                <Formik
                                    initialValues={{
                                        newPassword: '', confirmNewPassword: ''
                                    }}
                                    validationSchema={schema}
                                    onSubmit={(values) => {
                                        setEditUserReqs({changeType: 'newPassword'})
                                        setSpecificErrorMsg({ changeType: null, errorMsg: null })
                                        setEditProfileReqs({
                                            url: 'users/password-reset',
                                            requestBody: {
                                                newPassword: values.newPassword,
                                                user_id
                                            },
                                            changeType: 'newPassword'
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
                                                    disabled={editUserReqs.changeType == 'newPassword' ? true : false}
                                                    style={{
                                                        opacity: editUserReqs.changeType == 'newPassword' ? 0.76 : 1
                                                    }}
                                                >
                                                    {
                                                        editUserReqs.changeType == 'newPassword' && <span><Spinner size="sm" className="mx-2" /></span>
                                                    }
                                                    {
                                                        editUserReqs.changeType == 'newPassword' ? 'Resetting' : 'Reset Password'
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
    )    
}