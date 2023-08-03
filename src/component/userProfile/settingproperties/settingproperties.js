import React, { useEffect, useRef, useState } from 'react'
import Styles from '../settingproperties/settingproperties.module.css'
// import nikelogo from '../../../images/nikelogo.png'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import NoState from '../../noState/NoState';
import { AiFillCheckCircle } from 'react-icons/ai'
import { HiOutlineMail } from 'react-icons/hi'
import { GiRotaryPhone, GiCancel } from 'react-icons/gi'
import { FaScrewdriverWrench } from 'react-icons/fa6'
import { TbHomeCheck } from 'react-icons/tb'
import VerticalScroll from '../../scroll/VerticalScroll';
import * as yup from 'yup'
import { EMAIL_REG_EXP, PHONE_REG_EXP } from '../../globals/globals';
import { Spinner } from 'react-bootstrap';
import CustomErrorMsg from '../../errorMessage/CustomErrorMsg';
import ScrollToTop from '../../scroll/ScrollToTop';
import { cloudinaryUpload, requestApi } from '../../apiRequests/requestApi';
import ResetPassword from './ResetPassword';
import { useFilePicker } from 'use-file-picker';




function Settingproperties({ user_CP, setUser_CP, accessToken, navigateTo }) {
    const userProfileSettingsRef = useRef(null)

    const [editProfileReqs, setEditProfileReqs] = useState()
    const [errorMsg, setErrorMsg] = useState()
    const [emailInput, setEmailInput] = useState()
    const [specificErrorMsg, setSpecificErrorMsg] = useState({ changeType: null, errorMsg: null})
    const [editUserReqs, setEditUserReqs] = useState({ changeType: null })
    const [passwordResetModal, setPasswordResetModal] = useState(false)
    const [showEditPassword, setShowEditPassword] = useState(false)
    const [oldPasswordInput, setOldPasswordInput] = useState('')
    const [newProfileImg, setNewProfileImg] = useState()

    const [openProfileFileSelector, {}] = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        maxFileSize: 2,
        imageSizeRestrictions: {
            maxHeight: 100,
            maxWidth: 100,
            minHeight: 78,
            minWidth: 78,
        },
        onFilesRejected: ({ errors }) => {
            setSpecificErrorMsg({ changeType: 'profileimg', errorMsg: 'Invalid file type/size. Rules: Less than 2mb. 78x100' })
        },
        onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
            const { path, content } = filesContent[0]
            setNewProfileImg(content)
            setSpecificErrorMsg({ changeType: null, errorMsg: null })
        },
    });  
    
    const goHome = () => navigateTo('/')

    const hidePasswordResetModal = () => {
        setPasswordResetModal(false)
        setShowEditPassword(false)
        setSpecificErrorMsg({ changeType: null, errorMsg: null})
        return
    }

    const showPasswordResetModal = () => {
        setPasswordResetModal(true)
    }

    useEffect(() => {
        if(editProfileReqs){
            updateCustomerProfile({ reqs: editProfileReqs })
        }
    }, [editProfileReqs])

    const updateCustomerProfile = async ({ reqs }) => {
        if(reqs){
            const { requestBody, url, changeType } = reqs
            const updatedCustomer = await requestApi({ url, data: requestBody, token: accessToken, method: 'put' })
            const { responseStatus, result, errorMsg } = updatedCustomer
            if(responseStatus){
                if(changeType == 'oldPassword'){
                    setShowEditPassword(true)
                } else if(changeType == 'newPassword'){
                    hidePasswordResetModal()
                    setUser_CP(prev => ({
                        ...prev, 
                        alertModal:{message: 'Password reset successful'},
                        details: {
                            ...prev.details
                        }
                    }))
                } else{
                    setUser_CP(prev => ({
                        ...prev,
                        alertModal: {message: 'User profile successfully updated'},
                        details: {
                            ...prev.details,
                            ...requestBody
                        }
                    }))
                }

                setEditUserReqs({ changeType: null })
                setNewProfileImg('')
                return setEditProfileReqs('')
            } else{
                if(!requestBody.username){
                    setSpecificErrorMsg({ changeType, errorMsg: errorMsg.error })
                } else{
                    setErrorMsg(errorMsg.error)
                }

                setNewProfileImg('')
                setEditUserReqs({ changeType: null })
                return setEditProfileReqs('')
            }                
        } else{
            setNewProfileImg('')
            setErrorMsg('Fault is on our end, try again later...')
            setEditUserReqs({ changeType: null })
            setSpecificErrorMsg({ changeType: null, errorMsg: null} )
            return setEditProfileReqs('')            
        }
    }

    if(!user_CP){
        return <NoState />
    }


    const { details } = user_CP
    const { profileimg, email, phonenumber, username, customer_id } = details

    const initiateEmailChange = () => {
        if(!emailInput){
            return setSpecificErrorMsg({ changeType: 'email', errorMsg: 'Nothing set here' })
        }

        if(!emailInput.match(EMAIL_REG_EXP)){
            return setSpecificErrorMsg({ changeType: 'email', errorMsg: 'Invalid email address' })
        }

        setSpecificErrorMsg({ changeType: null, errorMsg: null })

        setEmailInput('')

        setEditUserReqs({changeType: 'email'})
        setEditProfileReqs({
            url: 'users/update',
            requestBody: { email: emailInput, user_id: customer_id },
            changeType: 'email'
        })
    }

    const initiatePasswordConfirmation = () => {
        if(!oldPasswordInput){
            return setSpecificErrorMsg({ changeType: 'oldPassword', errorMsg: 'Cannot be empty!'})
        }

        setSpecificErrorMsg({ changeType: null, errorMsg: null})
        setOldPasswordInput('')

        return setEditProfileReqs({
            url: 'users/password-confirmation',
            changeType: 'oldPassword',
            requestBody: {
                oldPassword: oldPasswordInput,
                user_id: customer_id,
            }
        })
    }    

    const handleEmailInputChange = e => {
        if(e){
            setSpecificErrorMsg({ changeType: null, errorMsg: null })
            setEmailInput(e.target.value)
        }

        return;
    }

    const handleOldPasswordInputChange = e => {
        if(e){
            setOldPasswordInput(e.target.value)
        }

        return;
    }

    const rejectNewProfile = () => {
        setNewProfileImg('')
        setSpecificErrorMsg({ changeType: null, errorMsg: null })
    }

    const uploadToCloudinary = async () => {
        setEditUserReqs({ changeType: 'profileimg' })
        setSpecificErrorMsg({ changeType: null, errorMsg: null })

        if(newProfileImg){
            const newProfile = await cloudinaryUpload({ files: [newProfileImg] })
            const { responseStatus, result, errorMsg } = newProfile
            if(responseStatus){
                if(result.length > 0){
                    return setEditProfileReqs({
                        url: 'users/customers/update-customer',
                        requestBody: {
                            profileimg: result[0],
                            customer_id: customer_id
                        },
                        changeType: 'profileimg'
                    })
                }
            } 
        }

        setEditUserReqs({ changeType: null })
        setSpecificErrorMsg({ changeType: 'profileimg', errorMsg: 'Error uploading photo' })
    }

    const schema = yup.object({
        // email: yup.string().email('Must be a valid email address!').required('Email address is required'),
        username: yup.string(),
        phonenumber: yup.string().matches(PHONE_REG_EXP, 'Invalid phone number')
    })    

  return (
    <div className={`h-100 py-5 ${Styles.settingprofileform}`}>
        <div className={`right-border px-4 col-lg-4 ${Styles.avatarprofilecontainer}`}>
            <div className='mb-4'>
                <h6 className="m-0 p-0 mb-3 hotel-profile-main-admin-profile-header">Profile</h6>   
            </div>
            <div className='p-1 rounded-circle rounded-border'>
                <img src={newProfileImg ? newProfileImg : profileimg} alt="#" className='rounded-circle' />
            </div>
            {
                specificErrorMsg.changeType == 'profileimg' &&
                    <div className='my-2'>
                        <CustomErrorMsg errorMsg={specificErrorMsg.errorMsg} />
                    </div>
            }            
            {
                newProfileImg &&
                    <div className='d-flex my-2 align-items-center'>
                        {
                            editUserReqs.changeType == 'profileimg'
                            ?
                                <div>
                                    <Spinner size={40} className="mx-4 p-0 my-0" 
                                        style={{
                                            color: '#FFB901'
                                        }}
                                    />
                                </div>
                            :
                                <button
                                    onClick={uploadToCloudinary}
                                    disabled={editProfileReqs || editUserReqs.changeType == 'profileimg' ? true : false}
                                    style={{
                                        opacity: editProfileReqs || editUserReqs.changeType ? 0.76 : 1
                                    }} 
                                    className='rounded-circle mx-4 bg-transparent'                               
                                >
                                    <AiFillCheckCircle size={40} color="#FFB901" />
                                </button>
                        }
                        <button
                            onClick={rejectNewProfile}
                            disabled={editProfileReqs || editUserReqs.changeType == 'profileimg' ? true : false}
                            style={{
                                opacity: editProfileReqs || editUserReqs.changeType ? 0.76 : 1
                            }}
                            className='mx-4 rounded-circle bg-transparent'
                        >
                            <GiCancel size={40} color="#1F1F1F" />
                        </button>
                    </div>
            }
            <div className={`mb-4 ${Styles.avatarcredentialsnames}`}>                
                <h4 className={`p-0 m-0 mb-4 ${Styles.usersname}`}>Hello, {username}</h4>
                <p className={`p-0 m-0 mb-2 ${Styles.gmail}`}>
                    <span className='mx-2'>
                        <HiOutlineMail size={25} />
                    </span>
                    {email}
                </p>
                <p className={`p-0 m-0 ${Styles.phonenumber}`}>
                    <span className='mx-2'>
                        <GiRotaryPhone size={25} />
                    </span>                    
                    {phonenumber}
                </p>
            </div>
            <div className='d-flex'>
                <button
                    onClick={goHome}
                    className="login-form-btn px-3 py-2 d-flex justify-content-center black-button col-lg-3"
                >
                    <TbHomeCheck 
                        color='#FFFFFF'
                        className='hotel-profile-nav-link' 
                        size={40} 
                    /> 
                </button>
                <button
                    className="login-form-btn px-3 py-2 mx-2 col-lg-8"
                    onClick={openProfileFileSelector}
                >
                    Change profile
                </button>            
            </div>
        </div>
        <div className={`col-lg-7 px-2 ${Styles.settingformcontainer}`}>
            <VerticalScroll defaultHeight="60vh">
                <ScrollToTop condition={errorMsg} />
                <Formik
                    initialValues={{ username: '', phonenumber: '' }}
                    validationSchema={schema}
                    onSubmit={(values, { resetForm }) => {
                        if(values.phonenumber || values.username){
                            const requestBody = {}

                            if(values.username) requestBody.username = values.username;
                            if(values.phonenumber) requestBody.phonenumber = values.phonenumber;

                            setEditProfileReqs({
                                url: 'users/customers/update-customer',
                                requestBody: {
                                    ...requestBody,
                                    customer_id: customer_id
                                }
                            })
                            setErrorMsg('')

                            resetForm()
                        }
                    }}
                    >
                    {({ values, handleBlur, handleChange, handleSubmit, handleReset }) => (
                        <div className={`px-5 ${Styles.formfilling}`}>
                            <div className={`mb-5 ${Styles.settingheaders}`}>
                                <h6 className={`${Styles.basicInfoHeader} m-0 p-0`}>ACCOUNT SETTINGS</h6>
                                <div className={Styles.bottomm}>
                                    <button
                                        className="login-form-btn p-3"
                                        onClick={() => {
                                            handleReset()
                                            setUser_CP(prev => ({
                                                ...prev, alertModal: {message: 'Changes reverted'}
                                            }))
                                        }}
                                        disabled={editProfileReqs ? true : false}
                                        style={{
                                            opacity: editProfileReqs ? 0.76 : 1
                                        }}
                                    >
                                        Revert
                                    </button>
                                    <button
                                        className="login-form-btn mx-2 p-3 black-button"
                                        onClick={handleSubmit}
                                        disabled={editProfileReqs ? true : false}
                                        style={{
                                            opacity: editProfileReqs ? 0.76 : 1
                                        }}                                        
                                    >
                                        {
                                            editProfileReqs &&
                                                <span><Spinner size="sm" className="mx-2" /></span>                                                   
                                        }                                                
                                        {
                                            editProfileReqs ? 'Saving...' : 'Save'
                                        }                                        
                                    </button>                                    
                                </div>
                            </div>

                            {
                                errorMsg && <CustomErrorMsg errorMsg={errorMsg} />
                            }

                            <div className='mb-5 border-bottom pb-4'>
                                <div className="mb-4">
                                    <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Basic User Information</h6>                                    
                                </div>                            

                                <div className='mb-4'>
                                    <label htmlFor="username" className="login-form-label mb-2">Username: {username}</label>
                                    <br/>
                                    <input 
                                        value={values.username}
                                        name="username"
                                        placeholder={'your new username'}
                                        onInput={handleChange}
                                        onBlur={handleBlur}
                                        className="login-form-input-field p-2 w-100"
                                        type="text"
                                    />                                    
                                    <p className="login-error-msg text-center my-2">
                                        <ErrorMessage name="username" />
                                    </p>
                                </div>  

                                <div className='mb-4'>
                                    <label htmlFor="phonenumber" className="login-form-label mb-2">Phone Number: {phonenumber}</label>
                                    <br/>
                                    <input 
                                        value={values.phonenumber}
                                        name="phonenumber"
                                        placeholder={'your new phone number'}
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

                            <div>
                                <div className='mb-4'>
                                    <div className="mb-3">
                                        <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Private User Information</h6>                                    
                                    </div>   
                                    <div className="mb-4">
                                        <p className="login-form-label mb-2">Password:</p>
                                        <p className="custom-placeholder">*****************</p>
                                    </div> 
                                    <button 
                                        className="login-form-btn p-3"
                                        onClick={showPasswordResetModal}
                                    >
                                        Change Password
                                    </button>
                                </div>

                                <div className='mb-4'>
                                    <label htmlFor="email" className="login-form-label mb-2">Email Address: {email}</label>
                                    <br/>
                                    <input 
                                        name="email"
                                        placeholder={'newemail@example.com'}
                                        onChange={handleEmailInputChange}
                                        className="login-form-input-field p-2 w-75"
                                        type="email"
                                        value={emailInput}
                                    />
                                    <button 
                                        onClick={initiateEmailChange}
                                        disabled={editProfileReqs ? true : false}
                                        style={{background: '#1F1F1F', opacity: editProfileReqs ? 0.76 : 1}}
                                        className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                    >
                                        {
                                            editUserReqs 
                                            ?
                                                editUserReqs.changeType == 'email'
                                                ?
                                                    <span><Spinner size="sm" className="mx-2" /></span>
                                                :
                                                    <FaScrewdriverWrench size={15} />                                            
                                            :
                                                <FaScrewdriverWrench size={15} />
                                        }
                                    </button>                                                 
                                    {
                                        specificErrorMsg.changeType == 'email' &&
                                            <p className="login-error-msg text-center my-2">
                                                <CustomErrorMsg noCenter={true}  errorMsg={specificErrorMsg.errorMsg} />
                                            </p>                                        
                                    }                       
                                </div>                                                                                          
                            </div>                                                                                
                        </div>
                    )}
                </Formik>
            </VerticalScroll>
        </div>

        <ResetPassword 
            passwordResetModal={passwordResetModal}
            hidePasswordResetModal={hidePasswordResetModal}
            showEditPassword={showEditPassword}
            specificErrorMsg={specificErrorMsg}
            handleOldPasswordInputChange={handleOldPasswordInputChange}
            editUserReqs={editUserReqs} 
            userProfileSettingsRef={userProfileSettingsRef} 
            user_id={customer_id} 
            setEditUserReqs={setEditUserReqs}
            oldPasswordInput={oldPasswordInput}
            setEditProfileReqs={setEditProfileReqs}
            initiatePasswordConfirmation={initiatePasswordConfirmation}
            setSpecificErrorMsg={setSpecificErrorMsg}
        />
    </div>
  )
}

export default Settingproperties