import React, { useEffect, useState } from "react";
import HotelProfileNavigation from "./HotelProfileNavigation";
import { Formik, ErrorMessage } from "formik";
import * as yup from 'yup'
import '../../auth/css/auth.css'
import hotelcoverimg from '../../../images/testHotel/testHotelCover.jpg'
import hotelcoverprofile from '../../../images/testHotel/testHotelProfile.png'
import CustomErrorMsg from "../../errorMessage/CustomErrorMsg";
import { FaScrewdriverWrench } from 'react-icons/fa6'
import Loading from "../../loading/Loading";
import { cloudinaryUpload, requestApi } from "../../apiRequests/requestApi";
import { Spinner } from "react-bootstrap";
import { ONLY_NUMBERS_REG_EXP, PHONE_REG_EXP } from "../../globals/globals";
import { useFilePicker } from "use-file-picker";





export default function EditHotelProfile({ user_HP, accessToken, setUser_HP }){

    const [hotelEmailInput, setHotelEmailInput] = useState()
    const [hotelNameInput, setHotelNameInput] = useState()
    const [hotelPhoneNumberInput, setHotelPhoneNumberInput] = useState()

    const [profileChangeReqs, setProfileChangeReqs] = useState()
    const [changeErrorMsg, setChangeErrorMsg] = useState({ changeType: null, errorMsg: null })
    const [coverimg, setCoverImg] = useState()
    const [profileimg, setProfileImg] = useState()

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
            setChangeErrorMsg({ changeType: 'profileimg', errorMsg: 'Invalid file type/size. Rules: Less than 2mb. 78x100' })
        },
        onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
            const { path, content } = filesContent[0]
            setProfileImg(content)
            setChangeErrorMsg({ changeType: null, errorMsg: null })
        },
    });

    const [openCoverFileSelector, {}] = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        maxFileSize: 2,
        imageSizeRestrictions: {
            minHeight: 768,
            maxWidth: 1400,
            maxHeight: 800,
            minWidth: 1366,
        },
        onFilesRejected: ({ errors }) => {
            setChangeErrorMsg({ changeType: 'coverimg', errorMsg: 'Invalid file type/size. Rules: Less than 2mb width: 768 to 800 height: 1366 to 1400' })
        },
        onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
            const { path, content } = filesContent[0]
            setCoverImg(content)
            setChangeErrorMsg({ changeType: null, errorMsg: null })
        },
    });    

    useEffect(() => {
        if(profileChangeReqs){
            if(profileChangeReqs.changeType && profileChangeReqs.value){
                hotelProfileEdit({reqs: profileChangeReqs})
            }
        }
    }, [profileChangeReqs])

    const uploadToCloudinary = async({ files, changeType }) => {
        if(files){
            setProfileChangeReqs({ changeType })
            const filesUpload = await cloudinaryUpload({files})
            const { result, responseStatus, errorMsg } = filesUpload
    
            if(responseStatus){
                initiateProfileChange({ changeType, value: result[0] })
            } else{
                setProfileChangeReqs()
                setChangeErrorMsg({ changeType: null, errorMsg: errorMsg.error })
            }
    
            return;
        } else{
            setChangeErrorMsg({ changeType, errorMsg: `Error updating profile. The fault's on our end, we are fixing it. Try again later!` })            
        }
    }    

    const hotelProfileEdit = async ({ reqs }) => {
        const { changeType, value, url } = reqs

        if(user_HP){
            const { hotel_id } = user_HP.details
            const requestBody = {
                [changeType]: value,
                [url ? 'user_id' : 'hotel_id']: hotel_id
            }
            const updatedHotelProfile = await requestApi({ url: url ? url : 'users/hotels/update-hotel', method: 'put', data: requestBody, token: accessToken })
            const { responseStatus, result, errorMsg } = updatedHotelProfile

            if(responseStatus){
                // const { data } = result
                setUser_HP(prev => ({
                    ...prev,
                    alertModal: {message: 'hotel profile successfully updated'},
                    newRoute: null,
                    newRoute_HP: null,
                    details: {
                        ...prev.details,
                        [changeType]: value
                    }
                }))
            } else{
                setProfileChangeReqs('')
                setChangeErrorMsg({ changeType, errorMsg: errorMsg.error })
            }
            


        } else{
            setProfileChangeReqs('')
            setChangeErrorMsg({ changeType, errorMsg: `Error updating profile. The fault's on our end, we are fixing it. Try again later!` })
        }


        resetInputs()
        return setProfileChangeReqs()
    }

    const resetInputs = () => {
        setHotelEmailInput('')
        setHotelNameInput('')
        setHotelPhoneNumberInput('')
        setCoverImg('')
        setProfileImg('')
    }

    const initiateProfileChange = ({ changeType, value }) => {
        if(value){
            if(changeType == 'phonenumber'){
                if(!(value.match(PHONE_REG_EXP))){
                    setProfileChangeReqs()
                    return setChangeErrorMsg({ changeType, errorMsg: 'Invalid phone number provided!' })
                }
            }

            if(changeType == 'accountnumber'){
                if(!(value.match(ONLY_NUMBERS_REG_EXP))){
                    setProfileChangeReqs()
                    return setChangeErrorMsg({ changeType, errorMsg: 'Invalid account number provided' })
                }
            }


            setProfileChangeReqs({ 
                changeType, 
                value,
                url: changeType == 'email' ? 'users/update' : null
            })
            setChangeErrorMsg({ changeType: null, errorMsg: null })
        } else{
            setProfileChangeReqs()
            setChangeErrorMsg({ changeType, errorMsg: 'No change found here!' })
        }

        return;
    }    

    
    if(user_HP){

        const handleEmailChange = (e) => e && setHotelEmailInput(e.target.value)
        const handleHotelNameChange = (e) => e && setHotelNameInput(e.target.value)
        const handlePhoneNumberChange = (e) => e && setHotelPhoneNumberInput(e.target.value)

        const { details } = user_HP

        const { email, phonenumber, hotelname, rating } = details
    
        return (
            <div className="mx-3 d-flex justify-content-center">
                <div className="col-lg-12">
                    <div className="py-3">
                        <div>
                            <div className="mb-3">
                                <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Hotel Details</h6>                                    
                            </div> 
                            <div className="mb-4">
                                <label htmlFor="hotelname" className="login-form-label mb-2">Hotel Name</label>
                                <br/>
                                <input 
                                    name="hotelname"
                                    value={hotelNameInput}
                                    onChange={handleHotelNameChange}
                                    placeholder={hotelname ? hotelname : 'hotel name'}
                                    className="login-form-input-field p-2 w-75"
                                    type="text"
                                />
                                <button 
                                    onClick={() => initiateProfileChange({ changeType: 'hotelname', value: hotelNameInput })}
                                    disabled={profileChangeReqs ? true : false}
                                    style={{background: '#1F1F1F', opacity: profileChangeReqs ? 0.76 : 1}}
                                    className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                >
                                    {
                                        profileChangeReqs 
                                        ?
                                            profileChangeReqs.changeType == 'hotelname'
                                            ?
                                                <span><Spinner size="sm" className="mx-2" /></span>
                                            :
                                                <FaScrewdriverWrench size={15} />                                            
                                        :
                                            <FaScrewdriverWrench size={15} />
                                    }
                                </button>  
                                {
                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'hotelname'
                                    ?
                                        <p className="login-error-msg text-center my-2">
                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                        </p>
                                    :
                                        <></>                                    
                                }
                            </div> 
                            <div className="mb-4">
                                <label htmlFor="email" className="login-form-label mb-2">Email address</label>
                                <br/>
                                <input 
                                    onChange={handleEmailChange}
                                    placeholder={email ? email : "email"}
                                    className="login-form-input-field p-2 w-75"
                                    type="text"
                                    value={hotelEmailInput}
                                />
                                <button 
                                    onClick={() => initiateProfileChange({ changeType: 'email', value: hotelEmailInput })}
                                    disabled={profileChangeReqs ? true : false}
                                    style={{background: '#1F1F1F', opacity: profileChangeReqs ? 0.76 : 1}}
                                    className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                >
                                   {
                                        profileChangeReqs 
                                        ?
                                            profileChangeReqs.changeType == 'email'
                                            ?
                                                <span><Spinner size="sm" className="mx-2" /></span>
                                            :
                                                <FaScrewdriverWrench size={15} />                                            
                                        :
                                            <FaScrewdriverWrench size={15} />
                                    }
                                </button>                            
                                {
                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'email'
                                    ?
                                        <p className="login-error-msg text-center my-2">
                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                        </p>
                                    :
                                        <></>                                    
                                }
                            </div>                         
                            <div className="mb-4">
                                <label htmlFor="phonenumber" className="login-form-label mb-2">Phone number</label>
                                <br/>
                                <input 
                                    onChange={handlePhoneNumberChange}
                                    name="phonenumber"
                                    placeholder={phonenumber ? phonenumber : "phone number"}
                                    className="login-form-input-field p-2 w-75"
                                    type="text"
                                    value={hotelPhoneNumberInput}
                                />
                                <button 
                                    onClick={() => initiateProfileChange({ changeType: 'phonenumber', value: hotelPhoneNumberInput })}
                                    disabled={profileChangeReqs ? true : false}
                                    style={{background: '#1F1F1F', opacity: profileChangeReqs ? 0.76 : 1}}
                                    className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                >
                                   {
                                        profileChangeReqs 
                                        ?
                                            profileChangeReqs.changeType == 'phonenumber'
                                            ?
                                                <span><Spinner size="sm" className="mx-2" /></span>
                                            :
                                                <FaScrewdriverWrench size={15} />                                            
                                        :
                                            <FaScrewdriverWrench size={15} />
                                    }
                                </button>                            
                                {
                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'phonenumber'
                                    ?
                                        <p className="login-error-msg text-center my-2">
                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                        </p>
                                    :
                                        <></>                                    
                                }
                            </div>
                            <div className="mb-4">
                                <div className="mb-3">
                                    <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Hotel Profile</h6>                                    
                                </div> 
                                <div className="d-flex align-items-center">
                                    <div className="col-lg-5 d-flex flex-column justify-content-center align-items-center">
                                        <div>
                                            <h6>Profile Image</h6>
                                        </div>                                                
                                        <div>
                                            <img 
                                                src={ profileimg ? profileimg : details.profileimg } 
                                                className="mb-3 col-lg-12" 
                                            />
                                        </div>
                                        {
                                            changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'profileimg'
                                            ?
                                                <p className="login-error-msg text-center">
                                                    <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                                </p>
                                            :
                                                <></>                                    
                                        }                                        
                                        <div className="d-flex">
                                            <button 
                                                disabled={profileChangeReqs ? true : false}
                                                style={{opacity: profileChangeReqs ? 0.76 : 1}}
                                                onClick={openProfileFileSelector}
                                                className="hotel-profile-main-admin-profile-btn border-0 px-4 py-2 mx-1"
                                            >
                                                Change Image
                                            </button>
                                            <button
                                                onClick={() => uploadToCloudinary({ files: [profileimg], changeType: 'profileimg' })}
                                                disabled={profileChangeReqs ? true : false}
                                                style={{background: '#1F1F1F', opacity: profileChangeReqs ? 0.76 : 1}}
                                                className="hotel-profile-main-admin-profile-btn border-0 px-4 py-2 mx-1 black-button">
                                                {
                                                    profileChangeReqs 
                                                    ?
                                                        profileChangeReqs.changeType == 'profileimg'
                                                        ?
                                                            <span><Spinner size="sm" className="mx-2" /></span>
                                                        :
                                                            <FaScrewdriverWrench size={15} />                                            
                                                    :
                                                        <FaScrewdriverWrench size={15} />
                                                }
                                            </button>
                                        </div>                                                    
                                    </div>                                             
                                    <div className="col-lg-5 d-flex flex-column justify-content-center align-items-center">
                                        <div>
                                            <h6>Cover Image</h6>
                                        </div>
                                        <div className="col-lg-8">
                                            <img 
                                                src={ coverimg ? coverimg : details.coverimg }
                                                className="mb-3 col-lg-12" 
                                            />
                                        </div>
                                        {
                                            changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'coverimg'
                                            ?
                                                <p className="login-error-msg text-center">
                                                    <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                                </p>
                                            :
                                                <></>                                    
                                        }                                        
                                        <div className="d-flex">
                                            <button 
                                                onClick={openCoverFileSelector}
                                                disabled={profileChangeReqs ? true : false}
                                                style={{opacity: profileChangeReqs ? 0.76 : 1}}                                                
                                                className="hotel-profile-main-admin-profile-btn border-0 px-4 py-2 mx-1"
                                            >
                                                Change Image
                                            </button>
                                            <button
                                                onClick={() => uploadToCloudinary({ files: [coverimg], changeType: 'coverimg' })}
                                                disabled={profileChangeReqs ? true : false}
                                                style={{background: '#1F1F1F', opacity: profileChangeReqs ? 0.76 : 1}}
                                                className="hotel-profile-main-admin-profile-btn border-0 px-4 py-2 mx-1 black-button"
                                            >
                                                {
                                                    profileChangeReqs 
                                                    ?
                                                        profileChangeReqs.changeType == 'coverimg'
                                                        ?
                                                            <span><Spinner size="sm" className="mx-2" /></span>
                                                        :
                                                            <FaScrewdriverWrench size={15} />                                            
                                                    :
                                                        <FaScrewdriverWrench size={15} />
                                                }
                                            </button>
                                        </div>                                                    
                                    </div>                                               
                                </div>
                            </div>                                                                                                         
                        </div>
    
                    </div>
                </div>
            </div>
        )
    } else{
        return <Loading />
    }
}