import React from "react";
import ReactCardFlip from 'react-card-flip';
import { AiOutlineScan } from 'react-icons/ai'
import { BsPersonFillCheck } from 'react-icons/bs'
import { MdSwapVert } from 'react-icons/md'
import { ImCancelCircle, ImExit } from 'react-icons/im'
import { Modal, Spinner } from 'react-bootstrap';
import dayjs from 'dayjs';
import CustomErrorMsg from '../../../../errorMessage/CustomErrorMsg';
import ZeroItems from "../../../../ZeroItems/ZeroItems";



export default function DisplayRoomReservations({
    roomReservations, setReservationCardFlip, isPending, setEditReservationReqs, editReservationReqs,
    reservationCardFlip, showApproved, showCancelled, secondaryFilter
}){

    const show = roomReservations && roomReservations.map((reservation, i) => {
        const { 
            room_id, pricingtype, amountforhotel, servicefee, username, email,
            profileimg, startdate, expirydate, reservation_id,                    
        } = reservation  
        
        const fullPrice = amountforhotel + servicefee
        const _startDate = new Date(startdate).toDateString()
        const _expiryDate = new Date(expirydate).toDateString()

        const edittingThisReservation = 
            isPending ? 
                editReservationReqs.data.reservation_id == reservation_id 
                ?
                    editReservationReqs.isLoading
                    ?
                        true
                    :
                        false
                :
                    false
            : 
                false

        const showCardFront = () => setReservationCardFlip({ id: i, isFlipped: false })
        const showCardBack = () => {
            if(edittingThisReservation){
                return;
            }
            if(editReservationReqs.isLoading){
                return;
            }

            return setReservationCardFlip({ id: i, isFlipped: true })
        }

        const initiateHotelExit = () => initiateReservationRequest({
            url: 'users/hotels/cancel-reservation',
            requestBody: {
                reservation_id, 
                status: 'enrolled',
                withRefund: false
            },
            method: 'put',
            permission: (isPending || showApproved),
            functionCall: 'exitHotel'
        })
        
        const initaiteReservationCancellation = () => initiateReservationRequest({ 
            // status: 'by_hotel', 
            // type: 'cancelled', 
            url: 'users/hotels/cancel-reservation',
            requestBody: {
                reservation_id, 
                status: 'by_hotel',
                withRefund: secondaryFilter ? true : false
            },
            method: 'put',
            permission: isPending,
            functionCall: 'cancelReservationByHotel'
        })

        const initiateReservationApproval = () => {
            let errorMsg = ''
            if(
                (dayjs(new Date(startdate)).isBefore(dayjs(new Date()), 'day')) //start date before today
                ||
                (dayjs(new Date(startdate)).isSame(dayjs(new Date()), 'day')) //start date same as today
            ){
                if(
                    (dayjs(new Date()).isBefore(new Date(expirydate), 'date')) //today before expiry date
                ){
                    return initiateReservationRequest({ 
                        url: 'users/hotels/enroll-customer-in',
                        requestBody: {
                            reservation_id,
                            status: 'enrolled',
                            enrollingfrom: reservation.enrollingfrom                            
                        },
                        method: 'put',
                        // type: 'enrolled',
                        // status: 'enrolled_in',
                        permission: isPending,
                        functionCall: 'enrollCustomer'
                    })
                } else{
                    errorMsg = 'Expiry date for this reservation has reached/passed. Cannot enroll'
                }
            } else{
                errorMsg = 'Start date for this reservation hasnt reached yet'
            }

            return setEditReservationReqs({ 
                reservation_id, 
                isLoading: false, 
                errorMsg, 
                data: { reservation_id: null }
            })
        }

        const initiateReservationRequest = ({ url, requestBody, method, permission, functionCall }) => {
            if(permission){
                setEditReservationReqs({ 
                    isLoading: true, 
                    data: requestBody, 
                    url, 
                    // type, 
                    // status,
                    method,
                    errorMsg: null,
                    reservation,
                    functionCall
                })
            }

            return            
        }

        const backView = (
            <div className='single-hotel-background-hotel-info-container p-2'>
                {
                    isPending && editReservationReqs.errorMsg && editReservationReqs.reservation_id == reservation_id
                    ?
                        <p className="login-error-msg text-center my-2">
                            <CustomErrorMsg errorMsg={editReservationReqs.errorMsg} />
                        </p>
                    :
                        <></>                                    
                }                 
                <div className="mb-2">
                    <h6 className='bottom-border m-0 p-0 pb-2 mb-2 text-center single-hotel-filter-rooms-label-text'>
                        Enroll Customer
                    </h6>  
                </div>
                <div className='text-break col-lg-12 border-bottom'>
                    <p className='text-break login-form-label m-0 p-0 mb-4'>
                        <strong>Reservation Id: </strong>
                        <span className='text-break'>{reservation_id}</span>
                    </p>
                    {
                        (isPending || (showApproved && secondaryFilter)) &&
                            <div>
                                {/* <div className='d-flex justify-content-center mb-2'>
                                    <h6 className='border-bottom col-lg-5 m-0 p-0 pb-2 text-center'>
                                        Enroll Customer
                                    </h6>    
                                </div> */}
                                <div className='d-flex justify-content-between align-items-start'>
                                    <div className='col-lg-6'>
                                        <button
                                            disabled={editReservationReqs.isLoading ? true : false}
                                            className="login-form-btn p-2 black-button mb-2"
                                            style={{
                                                fontSize: '15px',
                                                opacity: editReservationReqs.isLoading ? 0.76 : 1
                                            }}
                                        >
                                            <AiOutlineScan size={18} />
                                            <span className='mx-2'>Scan QR ?</span>
                                            <br />
                                        </button>
                                        <p 
                                            style={{
                                                fontSize: '13px'
                                            }}
                                            className='fst-italic single-hotel-hotel-room-count'
                                        >
                                            for extra security and customer validation
                                        </p>
                                    </div>
                                    <div className='col-lg-6 d-flex justify-content-end'>
                                        <button
                                            onClick={() => isPending ? initiateReservationApproval() : initiateHotelExit()}
                                            disabled={editReservationReqs.isLoading ? true : false}
                                            className="login-form-btn p-2"
                                            style={{
                                                fontSize: '15px',
                                                opacity: editReservationReqs.isLoading ? 0.76 : 1
                                            }}
                                        >
                                            {
                                                editReservationReqs.isLoading 
                                                ?
                                                    <span>
                                                        <Spinner size="sm" />
                                                        <span className='mx-2'>
                                                            {
                                                                isPending ? 'Approving' : 'Exiting'
                                                            }
                                                        </span>
                                                    </span>
                                                :
                                                    <span>
                                                        {
                                                            isPending
                                                            ?
                                                                <span>
                                                                    <BsPersonFillCheck size={22} />
                                                                    <span className='mx-2'>Approve</span>  
                                                                </span>
                                                            :
                                                                <span>
                                                                    <ImExit size={22} />
                                                                    <span className='mx-2'>Exit</span>
                                                                </span>
                                                        }
                                                    </span>                                                
                                            }
                                        </button>
                                    </div>                                                    
                                </div>                    
                            </div>
                    }
                </div>
                {
                    editReservationReqs && editReservationReqs.isLoading
                    ?
                        <div>...</div>
                    :
                        <div className='py-1 px-0'>
                            <MdSwapVert 
                                size={20} 
                                className='clickable' 
                                onClick={showCardFront}
                            />
                        </div>                    
                }                              
            </div>                
        )

        const frontView = (
            <div className="single-hotel-background-hotel-info-container p-2">
                {
                    isPending && editReservationReqs.errorMsg && editReservationReqs.reservation_id == reservation_id
                    ?
                        <p className="login-error-msg text-center my-2">
                            <CustomErrorMsg errorMsg={editReservationReqs.errorMsg} />
                        </p>
                    :
                        <></>                                    
                }                                  
                <div 
                    className='d-flex justify-content-between border-bottom'
                    style={{
                        height: '85%'
                    }}
                >
                    <div className='col-lg-4 h-100'>
                        <h6 className='bottom-border m-0 p-0 pb-2 mb-2 text-center single-hotel-filter-rooms-label-text'>
                            Customer Info
                        </h6>
                        <img src={profileimg} className='mb-2' />
                        <p className='login-form-label text-capitalize m-0 p-0 mb-2'>
                            {username}
                        </p>
                        <p className='login-form-label m-0 p-0'>
                            {email}
                        </p>                        
                    </div>
                    <div className='col-lg-8 h-100'>
                        <h6 className='bottom-border m-0 p-0 pb-2 mb-2 text-center single-hotel-filter-rooms-label-text'>
                            Reservation Info
                        </h6>                        
                        <div className=' mb-2'>
                            <div className='px-3'>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <h6 className='single-hotel-hotel-room-count'>Pricing type</h6>
                                    <p className='login-form-label text-capitalize'>{pricingtype}</p>
                                </div>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <h6 className='single-hotel-hotel-room-count'>Price</h6>
                                    <p className='login-form-label'>{fullPrice}</p>
                                </div> 
                                <div className="d-flex flex-wrap justify-content-between">
                                    <h6 className='single-hotel-hotel-room-count'>Start Date</h6>
                                    <p className='login-form-label'>{_startDate}</p>
                                </div>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <h6 className='single-hotel-hotel-room-count'>Expiry Date</h6>
                                    <p className='login-form-label'>{_expiryDate}</p>
                                </div>                                                                                                                                                                                                                                                     
                            </div>
                        </div>  
                    </div>
                </div>    
                <div
                    className='py-1 px-2 d-flex justify-content-between'
                    style={{height: '15%'}}
                >
                    <div>
                        <MdSwapVert 
                            size={20} 
                            className='clickable' 
                            onClick={showCardBack}
                        />
                    </div>
                    {
                        !showCancelled && !showApproved &&
                            <div className='d-flex justify-content-end rounded-circle'>
                                {
                                    edittingThisReservation 
                                    ?
                                        <div className='d-flex justify-content-center my-1'>
                                            <Spinner 
                                                size="sm"
                                                style={{
                                                    color: '#1F1F1F',
                                                }} 
                                            />
                                        </div>               
                                    :
                                    editReservationReqs && editReservationReqs.isLoading
                                    ?
                                        <p className='m-0 p-0 login-form-label'>...</p>
                                    :
                                        <div className='rounded-circle clickable hover-rotate'>
                                            <ImCancelCircle 
                                                onClick={initaiteReservationCancellation}
                                                size={20} 
                                                color="red" 
                                            />
                                        </div>                                                 
                                }                            
                            </div> 
                    }                
                </div>              
            </div>                
        )

        return (
            <div key={i} className='col-lg-5 mb-4'>
                <div className='col-lg-11'>
                    <ReactCardFlip 
                        isFlipped={
                            reservationCardFlip.id == i ?
                                reservationCardFlip.isFlipped
                            :
                                false
                        } 
                        flipDirection="vertical"
                    >
                        <div>
                            { frontView }
                        </div>

                        <div>
                            { backView }
                        </div>
                    </ReactCardFlip>
                </div>
            </div>
        )
    })


    return(
        <div>
            {
                roomReservations && roomReservations.length > 0
                ?
                    <div className="d-flex flex-wrap">
                        { show }
                    </div>
                :
                    <div>
                        <ZeroItems zeroText={'Zero reservations found'} />
                    </div>
            }
        </div>
    )
}