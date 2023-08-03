import React, { useEffect, useState } from "react";
import { IoChevronBackOutline } from 'react-icons/io5'
import { ImCancelCircle } from 'react-icons/im'
import VerticalScroll from "../../../../../scroll/VerticalScroll";
import CustomerInfo from "./CustomerInfo";
import ReservationInfo from "./ReservationInfo";
import { Disable } from 'react-disable';
import ScrollToTop from '../../../../../scroll/ScrollToTop'
import { Modal, Spinner } from "react-bootstrap";
import CustomErrorMsg from "../../../../../errorMessage/CustomErrorMsg";
import { requestApi } from "../../../../../apiRequests/requestApi";


export default function CreateReservation({
    selectedRoom, goToReservations, accessToken
}){

    const [customerDetails, setCustomerDetails] = useState()
    const [reservationDetails, setReservationDetails] = useState()
    const [finializeModal, setFinalizeModal] = useState({ visible: false, requestBody: null })
    const [createReservationReqs, setCreateReservationReqs] = useState({ isLoading: false, data: null, errorMsg: null })

    useEffect(() => {
        if(customerDetails && reservationDetails){
            const requestBody = {
                ...reservationDetails,
                customer_id: customerDetails.customer_id
            }
            setFinalizeModal({ visible: true, requestBody })
        }
    }, [customerDetails, reservationDetails])

    useEffect(() => {
        if(createReservationReqs.data){
            reservationCreation({ reqs: createReservationReqs.data })
        }
    }, [createReservationReqs])

    const reservationCreation = async ({ reqs }) => {
        const createdReservation = await requestApi({})
        //create endpoint on server as well. Reqs is your request body
    }

    const hideFinalizeModal = () => {
        setFinalizeModal({ visible: false, requestBody: null })
        return goToReservations()
    }

    const goToCustomerInfo = () => setCustomerDetails()

    const initiateReservationCreation = () => finializeModal.requestBody && setCreateReservationReqs({
        isLoading: true,
        errorMsg: null,
        data: finializeModal.requestBody
    })

    return (
        <div>
            <div className='mb-2 px-3 d-flex justify-content-between align-items-center border-bottom pb-3'>
                <div className="">
                    <h4 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">
                        Manually creating reservation for:
                    </h4>
                    <p className="m-0 p-0 login-form-label">
                        <strong>{selectedRoom.room_id}</strong>
                    </p>
                </div>
                <div className='d-flex align-items-center justify-content-end'>                    
                    <button 
                        onClick={goToReservations}
                        className="login-form-btn w-100 p-3 gray-button"
                        style={{
                            backgroundColor: 'transparent'
                        }}
                    >
                        <IoChevronBackOutline 
                            color="#1F1F1F"
                            size={40} 
                        />  
                        <span className="m-0 p-0 login-form-label mx-2">
                            back to reservations?
                        </span>
                    </button>                         
                </div>
            </div>  
            <VerticalScroll defaultHeight="80vh" scrollToTopCondition={customerDetails}>
                <div className="d-flex justify-content-between align-items-start py-5 px-3">   
                    <div 
                        className="col-lg-5"
                    >
                        <Disable disabledOpacity={0.28} disabled={customerDetails ? true : false}>
                            <CustomerInfo 
                                accessToken={accessToken}
                                setCustomerDetails={setCustomerDetails}
                            />
                        </Disable>
                    </div>
                    <div 
                        className="col-lg-6"                      
                    >
                        <Disable disabledOpacity={0.28} disabled={customerDetails ? false : true}>
                            <ReservationInfo 
                                selectedRoom={selectedRoom}
                                accessToken={accessToken}
                                goToCustomerInfo={goToCustomerInfo}
                                setReservationDetails={setReservationDetails}
                            />
                        </Disable>
                    </div>
                </div>
            </VerticalScroll>  

            <Modal
                show={finializeModal.visible}
                onHide={hideFinalizeModal}
                size='lg'
                backdrop="static"                 
            >
                <Modal.Body className="p-0 m-0">
                    <div className="bottom-border mb-5">
                        <div className='p-3 d-flex justify-content-between'>
                            <div className='d-flex align-items-center mb-3'>
                                <div className='mx-3 h-100'>
                                    <p className={`p-0 m-0 mb-4 px-3 left-border single-hotel-hotel-name`}>Creating Room Reservation</p>                                 
                                    <p className={`p-0 m-0 single-hotel-hotel-room-count`}>Room Id: <strong>{selectedRoom.room_id}</strong></p>
                                </div>                            
                            </div>
                            <div className="mx-2">
                                {
                                    !createReservationReqs.isLoading &&
                                        <ImCancelCircle 
                                            onClick={() => hideFinalizeModal}
                                            size={25} 
                                            color="#1F1F1F" 
                                            className="pointer" 
                                        />                                                    
                                }
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <div className="col-lg-8">
                            <h6 className="m-0 p-0 mb-2 text-center border-bottom hotel-profile-info-house-rules-text-counter">
                                {
                                    createReservationReqs.isLoading
                                    ?
                                        'Almost there...'
                                    :
                                        'One click away from your reservation'
                                }
                            </h6>                                 
                            {
                                createReservationReqs.isLoading
                                ?
                                    <div>
                                        <p 
                                            className={`text-center p-0 m-0 single-hotel-hotel-room-count`}>
                                                Just a minute, adding your reservation to our schedule...
                                                <span className="mx-2">
                                                    <Spinner 
                                                        size='sm' 
                                                        className="mx-2"
                                                        style={{
                                                            color: '#FFB901'
                                                        }}
                                                    />
                                                </span>
                                        </p>
                                    </div>
                                :
                                createReservationReqs.errorMsg
                                ?
                                    <p className="login-error-msg text-center my-2">
                                        <CustomErrorMsg errorMsg={createReservationReqs.errorMsg} />
                                    </p>                                                                        
                                :
                                    <button
                                        onClick={initiateReservationCreation}
                                        className="login-form-btn w-100 p-3"
                                    >
                                        Create Reservation
                                    </button>
                            }
                        </div>
                    </div>                    
                </Modal.Body>
            </Modal>        
        </div>
    )
}