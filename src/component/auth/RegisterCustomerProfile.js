// import React, { useEffect, useState } from "react";
// import AuthCarousel from "./auxiliary/AuthCarousel";
// import ScrollToTop from "../scroll/ScrollToTop";
// import { useLocation } from "react-router-dom";
// import NoState from "../noState/NoState";
// import logo from '../../images/logos/LogoBlock.svg'
// import { useFilePicker } from "use-file-picker";
// import { BiSolidUserCircle } from 'react-icons/bi'
// import CustomErrorMsg from "../errorMessage/CustomErrorMsg";

// export default function RegisterCustomerProfile({ navigateTo }){
//     const { state } = useLocation()

//     const [errorMsg, setErrorMsg] = useState()
//     const [profileimg, setProfileImg] = useState({ error: null, data: null, iconColor: '#000' })
//     const [signUpRequirements, setSignUpRequirements] = useState({ signUpInitiated: false })

//     const [openProfileFileSelector, {}] = useFilePicker({
//         readAs: 'DataURL',
//         accept: 'image/*',
//         multiple: false,
//         maxFileSize: 2,
//         imageSizeRestrictions: {
//             maxHeight: 100,
//             maxWidth: 100,
//             minHeight: 78,
//             minWidth: 78,
//         },
//         onFilesRejected: ({ errors }) => {
//             setProfileImg(prev => ({...prev, error: 'Invalid file size', data: null }))
//         },
//         onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
//             const { path, content } = filesContent[0]
//             setProfileImg(prev => ({...prev, error: null, data: content }))
//         },
//     });    

//     useEffect(() => {
//         if(signUpRequirements){
//             if(signUpRequirements.signUpInitiated && signUpRequirements.requestBody){
//                 createUser({ requestBody: signUpRequirements.requestBody })
//             }
//         }
//     }, [signUpRequirements])

//     const createUser = async ({ requestBody }) => {
//         // const newUser = await requestApi({ url: 'users/hotels/create', method: 'post', data: requestBody })
//         // const { responseStatus, result, errorMsg } = newUser
//         // if(responseStatus){
//         //     setSignUpRequirements({ signUpInitiated: false })
//         //     navigateTo('/login')
//         // } else{
//         //     setErrorMsg(errorMsg.error)
//         //     setSignUpRequirements({ signUpInitiated: false })
//         // }
//         // return entirePage && entirePage.classList.add('disable-all-click-events')
//     }  
    
//     const hoverProfileEnter = () => setProfileImg(prev => ({...prev, iconColor: '#FFB901'}))
//     const hoverProfileLeave = () => setProfileImg(prev => ({...prev, iconColor: '#000'}))

//     const openProfilePicker = () => {
//         setProfileImg(prev => ({...prev, error: null}))
//         openProfileFileSelector()
//     }    

//     const initiateAccountCreation = () => {
//         if(profileimg.data){
//             setSignUpRequirements({ signUpInitiated: true })
//             setErrorMsg(null)
//             return uploadFilesToCloudinary([profileimg.data])            
//         }

//         return alert('Select cover and/or profile image')
//     }  
    
//     const uploadFilesToCloudinary = async (files) => {
//         const filesUpload = await cloudinaryUpload({ files })
//         const { result, responseStatus, errorMsg } = filesUpload

//         if(responseStatus){
//             if(result.length > 0){
//                 if(state){
//                     const requestBody = {
//                         ...state.userDetails,
//                         coverimg: result[0],
//                         profileimg: result[1]
//                     }
//                     setSignUpRequirements({ signUpInitiated: true, requestBody })
//                 }
//             } else {
//                 setErrorMsg(errorMsg.error)                
//                 return setSignUpRequirements({ signUpInitiated: false })
//             }
//         } else{
//             setErrorMsg(errorMsg.error)            
//             return setSignUpRequirements({ signUpInitiated: false }) 
//         }
//     }    

//     if(state){
//         return (
//             <div className="login-container">
//                 <ScrollToTop condition={errorMsg} />
//                 <div className="d-flex">
//                     <div className="col-lg-6">
//                         <AuthCarousel />                                  
//                     </div>
    
//                     <div className="col-lg-6 p-5 bg-white">
//                         <div className="my-5"></div>
//                         <div className="mb-5">
//                             <div className="mb-5">
//                                 <div className="mb-5">
//                                     <img src={logo} />
//                                 </div>
//                                 <div>
//                                     <h1 className="login-form-header mb-4">Your profile</h1>
//                                     <p className="login-form-caption">
//                                         Registration in progress. Kindly provide your media information
//                                     </p>
//                                 </div>
//                             </div> 
    
//                             <div className="mb-3">
//                                 {
//                                     errorMsg && <CustomErrorMsg errorMsg={errorMsg} />
//                                 } 
//                                 <div className="mb-4">
//                                     <div className="d-flex justify-content-center">
//                                         <div className="d-flex justify-content-center align-items-center">
//                                             <button 
//                                                 onClick={openProfilePicker}
//                                                 onMouseEnter={hoverProfileEnter}
//                                                 onMouseLeave={hoverProfileLeave}
//                                                 className="py-2 d-flex justify-content-center align-items-center flex-column mx-2 upload-profile-container"
//                                             >
//                                                 {
//                                                     profileimg.data
//                                                     ?
//                                                         <img src={profileimg.data} className="rounded-circle col-lg-4 mb-2" />
//                                                     :
//                                                         <BiSolidUserCircle size={40} color={profileimg.iconColor} className="col-lg-12 mb-2" />
//                                                 }
//                                                 <h6 className="login-form-label m-0 mb-3 p-0">Customer Profile</h6>
//                                                 <p className="upload-profile-file-size-text m-0 mb-2 p-0 px-2">File size not greater than 2mb. Must be 78x100</p>
//                                                 {
//                                                     profileimg.error &&
//                                                         <p className="login-error-msg text-center m-0 p-0">{profileimg.error}</p>
//                                                 }
//                                             </button>
//                                             {
//                                                 usertype == 'hotel' && 
//                                                 <button 
//                                                     onClick={openCoverPicker}
//                                                     onMouseEnter={hoverCoverEnter}
//                                                     onMouseLeave={hoverCoverLeave}                                                
//                                                     className="d-flex py-2 justify-content-center align-items-center flex-column mx-2 upload-profile-container"
//                                                 >
//                                                     {
//                                                         coverimg.data
//                                                         ?
//                                                             <img src={coverimg.data} className="rounded-0 col-lg-7 mb-2" />
//                                                         :
//                                                             <FaHotel size={40} color={coverimg.iconColor} className="col-lg-12 mb-2" />
//                                                     }
//                                                     <h6 className="login-form-label m-0 p-0 mb-3">Hotel Cover</h6>
//                                                     <p className="upload-profile-file-size-text m-0 mb-2 p-0 px-2">File size not greater than 2mb. Within 1366x768 and 1400x800</p>
//                                                     {
//                                                         coverimg.error &&
//                                                             <p className="login-error-msg text-center m-0 p-0">{coverimg.error}</p>
//                                                     }                                                    
//                                                 </button>                                   
//                                             }
//                                         </div>
//                                     </div>
//                                 </div>                           
//                                 <button 
//                                     onClick={initiateAccountCreation}
//                                     disabled={(!coverimg.data || !profileimg.data) || signUpRequirements.signUpInitiated}
//                                     style={{
//                                         opacity: (!coverimg.data || !profileimg.data) || signUpRequirements.signUpInitiated ? 0.76 : 1
//                                     }}
//                                     className="login-form-btn w-100 p-3"
//                                     type="submit"
//                                 >
//                                     {
//                                         signUpRequirements.signUpInitiated &&
//                                             <span><Spinner size="sm" className="mx-2" /></span>                                                    
//                                     }
//                                     {
//                                         signUpRequirements.signUpInitiated 
//                                         ?
//                                             'Creating account...' : 'Register'                                                        
//                                     }                                                
//                                 </button>
//                             </div>    
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     } else{
//         return <NoState />
//     }
// }