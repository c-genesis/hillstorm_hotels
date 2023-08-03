import React from "react";
import CustomErrorMsg from "../../errorMessage/CustomErrorMsg";
import { BiSolidUserCircle } from 'react-icons/bi'
import { FaHotel } from 'react-icons/fa'
import { Spinner } from 'react-bootstrap'


export default function RegisterProfileAux({
    logo, errorMsg, openProfilePicker, hoverProfileEnter, hoverProfileLeave,
    profileimg, usertype, openCoverPicker, hoverCoverEnter, hoverCoverLeave,
    coverimg, initiateAccountCreation, signUpRequirements, hotelLocationInfo
}){
    
    
    return (
        <div>                        
            <div className="mb-3">
                {
                    errorMsg && <CustomErrorMsg errorMsg={errorMsg} />
                } 
                <div className="mb-4">
                    <div className="d-flex justify-content-center">
                        <div className="d-flex justify-content-center align-items-center">
                            <button 
                                onClick={openProfilePicker}
                                onMouseEnter={hoverProfileEnter}
                                onMouseLeave={hoverProfileLeave}
                                className="py-2 d-flex justify-content-center align-items-center flex-column mx-2 upload-profile-container"
                            >
                                {
                                    profileimg.data
                                    ?
                                        <img src={profileimg.data} className="rounded-circle col-lg-4 mb-2" />
                                    :
                                        <BiSolidUserCircle size={40} color={profileimg.iconColor} className="col-lg-12 mb-2" />
                                }
                                <h6 className="login-form-label m-0 mb-3 p-0">
                                    {
                                        usertype == 'hotel' ? 'Hotel Profile' : 'User Profile'
                                    }
                                </h6>
                                <p className="upload-profile-file-size-text m-0 mb-2 p-0 px-2">File size not greater than 2mb. Must be 78x100</p>
                                {
                                    profileimg.error &&
                                        <p className="login-error-msg text-center m-0 p-0">{profileimg.error}</p>
                                }
                            </button>
                            {
                                usertype == 'hotel' && 
                                <button 
                                    onClick={openCoverPicker}
                                    onMouseEnter={hoverCoverEnter}
                                    onMouseLeave={hoverCoverLeave}                                                
                                    className="d-flex py-2 justify-content-center align-items-center flex-column mx-2 upload-profile-container"
                                >
                                    {
                                        coverimg.data
                                        ?
                                            <img src={coverimg.data} className="rounded-0 col-lg-7 mb-2" />
                                        :
                                            <FaHotel size={40} color={coverimg.iconColor} className="col-lg-12 mb-2" />
                                    }
                                    <h6 className="login-form-label m-0 p-0 mb-3">Hotel Cover</h6>
                                    <p className="upload-profile-file-size-text m-0 mb-2 p-0 px-2">File size not greater than 2mb. Within 1366x768 and 1400x800</p>
                                    {
                                        coverimg.error &&
                                            <p className="login-error-msg text-center m-0 p-0">{coverimg.error}</p>
                                    }                                                    
                                </button>                                   
                            }
                        </div>
                    </div>
                </div>                           
                <button 
                    onClick={initiateAccountCreation}
                    disabled={signUpRequirements.signUpInitiated}
                    style={{
                        opacity: signUpRequirements.signUpInitiated ? 0.76 : 1
                    }}
                    className="login-form-btn w-100 p-3"
                    type="submit"
                >
                    {
                        signUpRequirements.signUpInitiated &&
                            <span><Spinner size="sm" className="mx-2" /></span>                                                    
                    }
                    {
                        signUpRequirements.signUpInitiated 
                        ?
                            'Creating account...' : 'Register'                                                        
                    }                                                
                </button>
            </div>
        </div>          
    )
}