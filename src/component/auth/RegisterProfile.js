import React, { useEffect, useState } from "react";
import AuthCarousel from "./auxiliary/AuthCarousel";
import logo from '../../images/logos/LogoBlock.svg'
import ScrollToTop from "../scroll/ScrollToTop";
import { useLocation } from "react-router-dom";
import { useFilePicker } from 'use-file-picker';
import { cloudinaryUpload, requestApi } from "../apiRequests/requestApi";
import './css/auth.css'
import Loading from "../loading/Loading";
import RegisterProfileAux from "./auxiliary/RegisterProfileAux";
import RegisterHotelLocation from "./auxiliary/RegisterHotelLocation";



export default function RegisterProfile({ navigateTo, setUser }){
    const { state } = useLocation()

    const [errorMsg, setErrorMsg] = useState()
    const [coverimg, setCoverImg] = useState({ error: null, data: null, iconColor: '#000' })
    const [profileimg, setProfileImg] = useState({ error: null, data: null, iconColor: '#000' })
    const [signUpRequirements, setSignUpRequirements] = useState({ signUpInitiated: false })
    const [hotelLocationInfo, setHotelLocationInfo] = useState()
    const [entirePage, setEntirePage] = useState()

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
            setProfileImg(prev => ({...prev, error: 'Invalid file size', data: null }))
        },
        onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
            const { path, content } = filesContent[0]
            setProfileImg(prev => ({...prev, error: null, data: content }))
        },
    });

    const [openCoverFileSelector, {}] = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        maxFileSize: 2,
        multiple: false,
        imageSizeRestrictions: {
            minHeight: 768,
            maxWidth: 1400,
            maxHeight: 800,
            minWidth: 1366,
        },
        onFilesRejected: ({ errors }) => {
            setCoverImg(prev => ({...prev, error: 'Invalid file size', data: null }))
        },
        onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
            const { path, content } = filesContent[0]
            setCoverImg(prev => ({...prev, error: null, data: content }))
        },
    });

    useEffect(() => {
        if(signUpRequirements){
            if(signUpRequirements.signUpInitiated && signUpRequirements.requestBody){
                createUser({ requestBody: signUpRequirements.requestBody })
            }
        }
    }, [signUpRequirements])

    useEffect(() => {
        const page = document.querySelector('.register-profile-page')
        if(page){
            setEntirePage(entirePage)
        }
    })

    const createUser = async ({ requestBody }) => {
        if(state){
            const { userDetails } = state            
            const url = userDetails.usertype == 'hotel' ? 'users/hotels/create' : '/users/customers/create'
            const newUser = await requestApi({ url, method: 'post', data: requestBody })
            const { responseStatus, result, errorMsg } = newUser
            if(responseStatus){
                setSignUpRequirements({ signUpInitiated: false })
                navigateTo('/login')
            } else{
                setErrorMsg(errorMsg.error)
                setSignUpRequirements({ signUpInitiated: false })
            }
            return entirePage && entirePage.classList.add('disable-all-click-events')
        }
    }

    const hoverProfileEnter = () => setProfileImg(prev => ({...prev, iconColor: '#FFB901'}))
    const hoverProfileLeave = () => setProfileImg(prev => ({...prev, iconColor: '#000'}))

    const openProfilePicker = () => {
        setProfileImg(prev => ({...prev, error: null}))
        setErrorMsg(null)
        openProfileFileSelector()
    }

    const hoverCoverEnter = () => setCoverImg(prev => ({...prev, iconColor: '#FFB901'}))
    const hoverCoverLeave = () => setCoverImg(prev => ({...prev, iconColor: '#000'}))

    const openCoverPicker = () => {
        setCoverImg(prev => ({...prev, error: null}))
        openCoverFileSelector()
    }

    const initiateAccountCreation = () => { 
        if(state) {
            const { userDetails } = state
            if(userDetails.usertype == 'hotel'){
                if(coverimg.data && profileimg.data && hotelLocationInfo){
                    entirePage && entirePage.classList.add('disable-all-click-events')
                    setSignUpRequirements({ signUpInitiated: true })
                    setErrorMsg(null)
                    return uploadFilesToCloudinary({files: [coverimg.data, profileimg.data], usertype: 'hotel'})            
                }
            }
            if(userDetails.usertype == 'customer'){
                if(profileimg.data){
                    entirePage && entirePage.classList.add('disable-all-click-events')
                    setSignUpRequirements({ signUpInitiated: true })
                    setErrorMsg(null)
                    return uploadFilesToCloudinary({files: [profileimg.data], usertype: 'customer'})            
                }                
            }
        }

        return setErrorMsg('All media entries required')
    }

    const uploadFilesToCloudinary = async ({files, usertype}) => {
        const filesUpload = await cloudinaryUpload({ files })
        const { result, responseStatus, errorMsg } = filesUpload

        if(responseStatus){
            if(result.length > 0){
                if(state){
                    let requestBody;
                    if(usertype == 'hotel'){
                        requestBody = {
                            ...state.userDetails,
                            coverimg: result[0],
                            profileimg: result[1],
                            ...hotelLocationInfo
                        }
                    } else{
                        requestBody = {
                            ...state.userDetails,
                            profileimg: result[0]
                        }                        
                    }
                    setSignUpRequirements({ signUpInitiated: true, requestBody })
                }
            } else {
                setErrorMsg(errorMsg.error)
                entirePage && entirePage.classList.remove('disable-all-click-events')
                return setSignUpRequirements({ signUpInitiated: false })
            }
        } else{
            setErrorMsg(errorMsg.error)
            entirePage && entirePage.classList.remove('disable-all-click-events')
            return setSignUpRequirements({ signUpInitiated: false }) 
        }
    }

    if(state){

        const { userDetails } = state
        const { usertype } = userDetails

        return (
            <div className="login-container">
                <ScrollToTop condition={errorMsg} />
                <div className="d-flex">
                    <div className="col-lg-6">
                        <AuthCarousel />                                  
                    </div>
    
                    <div className="col-lg-6 p-5 bg-white">
                        <div className="my-5"></div>
                        <div className="mb-5">
                            <div className="mb-5">
                                <img src={logo} />
                            </div>
                            <div>
                                <h1 className="login-form-header mb-4">Your profile</h1>
                                <p className="login-form-caption">
                                    Registration in progress. Kindly provide your media information
                                </p>
                                {
                                    usertype == 'hotel' && !hotelLocationInfo &&
                                        <p className="login-form-caption">
                                            Before that...tell us a bit about your hotel's location.
                                        </p>                                      
                                }                              
                            </div>
                        </div>
                        {
                            usertype == 'hotel'
                            ?
                                hotelLocationInfo
                                ?
                                    <RegisterProfileAux 
                                        logo={logo}
                                        errorMsg={errorMsg}
                                        openProfilePicker={openProfilePicker}
                                        hoverProfileEnter={hoverProfileEnter}
                                        hoverProfileLeave={hoverProfileLeave}
                                        profileimg={profileimg}
                                        usertype={usertype}
                                        openCoverPicker={openCoverPicker}
                                        hoverCoverEnter={hoverCoverEnter}
                                        hoverCoverLeave={hoverCoverLeave}
                                        coverimg={coverimg}
                                        initiateAccountCreation={initiateAccountCreation}
                                        signUpRequirements={signUpRequirements}
                                        hotelLocationInfo={hotelLocationInfo}
                                    />   
                                :
                                    <RegisterHotelLocation 
                                        setHotelLocationInfo={setHotelLocationInfo}
                                    />
                            :
                                <RegisterProfileAux 
                                    logo={logo}
                                    errorMsg={errorMsg}
                                    openProfilePicker={openProfilePicker}
                                    hoverProfileEnter={hoverProfileEnter}
                                    hoverProfileLeave={hoverProfileLeave}
                                    profileimg={profileimg}
                                    usertype={usertype}
                                    openCoverPicker={openCoverPicker}
                                    hoverCoverEnter={hoverCoverEnter}
                                    hoverCoverLeave={hoverCoverLeave}
                                    coverimg={coverimg}
                                    initiateAccountCreation={initiateAccountCreation}
                                    signUpRequirements={signUpRequirements}
                                    hotelLocationInfo={hotelLocationInfo}
                                />                                                             
                        }                                 
    
    
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
        )
    } else{
        setUser(prev => ({
            ...prev,
            newRoute: '/sign-up',
            alertModal: {message: 'to keep registration secure, refreshing warrantes you to begin the registration process all over', duration: 4000}
        }))

        return <Loading loadingText={''} />
    }
}