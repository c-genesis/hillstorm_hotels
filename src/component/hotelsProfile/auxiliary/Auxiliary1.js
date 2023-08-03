import React from 'react'
import { HiOutlineMail } from 'react-icons/hi'
import { GiRotaryPhone } from 'react-icons/gi'
import { BsArrowRight } from 'react-icons/bs'


export default function Auxiliary1({ 
    img, titleHeader, subHeader, phone, email, rating, secondBtnText, showArrow,
    toggleFunc1, show, showText, hideText, isActive, inActiveText, secondBtnFunc, hideBtns,
}){
    return (
        <div 
            className={`
                hotel-profile-main-admin-details-container pb-4
            `}                
        >
            <div className="d-flex flex-column align-items-center">
                <div className="col-lg-11 d-flex justify-content-center py-4 my-3">
                    <img src={img} className="col-lg-5 hotel-profile-main-admin-profile-container p-1" />                    
                </div>                
            </div> 
            <div className="d-flex flex-column align-items-center">
                {
                    rating &&
                        <p className='single-hotel-hotel-rating p-0 m-0 mb-2'>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                                    <path d="M4.54894 0.802052C4.8483 -0.119259 6.1517 -0.11926 6.45106 0.802051L6.95934 2.36639C7.09321 2.77841 7.47717 3.05737 7.9104 3.05737H9.55524C10.524 3.05737 10.9267 4.29699 10.143 4.86639L8.81232 5.8332C8.46183 6.08785 8.31518 6.53922 8.44905 6.95124L8.95733 8.51558C9.25669 9.43689 8.20221 10.203 7.41849 9.63361L6.08779 8.6668C5.7373 8.41215 5.2627 8.41215 4.91221 8.6668L3.58151 9.63361C2.7978 10.203 1.74331 9.43689 2.04267 8.51558L2.55095 6.95124C2.68483 6.53922 2.53817 6.08785 2.18768 5.8332L0.856976 4.86639C0.0732617 4.29699 0.476037 3.05737 1.44476 3.05737H3.0896C3.52283 3.05737 3.90678 2.77841 4.04066 2.36639L4.54894 0.802052Z" fill="#FFB901"/>
                                </svg>                        
                            </span> 
                            <span className='mx-2'>
                                {rating}
                            </span>
                        </p>                    
                }
                <h6 className="m-0 p-0 mb-3 hotel-profile-main-admin-profile-header">{titleHeader}</h6>                      
                <p className="m-0 p-0 mb-3 hotel-profile-main-admin-profile-sub-text">{subHeader}</p>
                <div className="d-flex align-items-center mb-3">
                    <GiRotaryPhone size={20} className="p-0 m-0" />
                    <p className="m-0 p-0 mx-2 hotel-profile-main-admin-profile-sub-text">{phone}</p>
                </div>                        
                <div className="d-flex align-items-center mb-3">
                    <HiOutlineMail size={20} className="p-0 m-0" />
                    <p className="m-0 p-0 mx-2 hotel-profile-main-admin-profile-sub-text">{email}</p>
                </div>
                {   
                    !hideBtns 
                    ?
                        <div>
                        {
                            isActive
                            ?
                                <div className='d-flex'>
                                    <button 
                                        onClick={toggleFunc1}
                                        className="hotel-profile-main-admin-profile-btn border-0 px-4 py-2">
                                            {
                                                show ? showText : hideText
                                            }
                                            {
                                                    showArrow &&
                                                    <span className="mx-2">
                                                        <BsArrowRight size={20} />
                                                    </span>                                                
                                            }
                                    </button>
                                    {
                                        secondBtnFunc &&                                    
                                            <button 
                                                onClick={secondBtnFunc}
                                                style={{background: '#1F1F1F'}}
                                                className="hotel-profile-main-admin-profile-btn border-0 px-4 py-2 mx-1 black-button"
                                            >
                                                {secondBtnText}
                                            </button> 
                                    }                                        
                                </div>
                            :
                                <p className="h-25 hotel-edit-profile-room-number">{inActiveText}</p>                               
                        }
                        </div>
                    :
                        <div></div>
                }                        
            </div>           
        </div>        
    )
}