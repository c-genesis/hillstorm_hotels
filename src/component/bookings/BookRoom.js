import React, { useState } from 'react'
import { Collapse, Modal, Spinner } from 'react-bootstrap'
import { ImCancelCircle } from 'react-icons/im'
import VerticalScroll from '../scroll/VerticalScroll'
import Calendar from 'react-calendar'
import dayjs from 'dayjs'
import './css/calendar.css'
import CustomErrorMsg from '../errorMessage/CustomErrorMsg'
import { requestApi } from '../apiRequests/requestApi'



export default function BookRoom({ 
    bookingModal, hideBookingModal, hotelDetails, pricingSelected, setPricingSelected, accessToken,
    calendarValue, onChangeCalendarValue, setOpenCalendar, openCalendar, dateConfirmed, setDateConfirmed,
    proceedToCheckout, user, setErrorMsg, errorMsg
}){
    const { visible, roomDetails, reservedDates } = bookingModal 

    const checkIfReserved = ({ date }) => {
        if(reservedDates){
            for(let i = 0; i < reservedDates.length; i++){
                if(dayjs(new Date(date)).isSame(new Date(reservedDates[i]), 'day')){
                    return true
                }
            }
        }

        return false
    }

    const length = 
        pricingSelected
        ?
            pricingSelected.type == 'daily'
            ?
                'day'
            :
            pricingSelected.type == 'monthly' ?
                'month'
            :
            pricingSelected.type == 'weekly' 
            ?
                'week'
            :
                ''
        :
            ''
    const expiryDate = calendarValue && length ? dayjs(calendarValue).add(1, length).toDate() : ''

    const confirmDateRequest = async () => {
        if(roomDetails && visible && hotelDetails && calendarValue && length){
            setDateConfirmed({ isLoading: true, errorMsg: null, isConfirmed: false })
            const requestBody = {
                length,
                startdate: calendarValue,
                hotel_id: hotelDetails.hotel_id, 
                room_id: roomDetails.room_id
            }
            const confirmingDate = await requestApi({ url: 'users/confirm-reservation-date', method: 'post', token: accessToken, data: requestBody})
            const { responseStatus, result, errorMsg } = confirmingDate
            if(responseStatus){
                const { isReserved, isInThePast } = result
                if(isInThePast){
                    setDateConfirmed({ 
                        isLoading: false, 
                        errorMsg: 'Date selected is in the past',
                        isConfirmed: false
                    })                    
                } else if(isReserved){
                    setDateConfirmed({ 
                        isLoading: false, 
                        errorMsg: 'Time frame selected clashes with that of another customer. Either change room or change time selected', 
                        isConfirmed: false
                    })
                } else{
                    setDateConfirmed({ isLoading: false, errorMsg: null, isConfirmed: true})
                }
            } else{
                setDateConfirmed({ isLoading: false, errorMsg: errorMsg.error, isConfirmed: false})
            }

            return
        }

        return setDateConfirmed({ isLoading: false, errorMsg: 'Something went wrong, try again later...!', isConfirmed: false })
    }    

    if(visible && roomDetails && hotelDetails){

        const { catalogue, room_id, pricing, percentagediscount } = roomDetails
        const { hotelname, profileimg, hotel_id, accountnumber } = hotelDetails

        const checkout = () => {
            if(!user){
                return setErrorMsg('You need to login to be able to create a reservation')
            }

            if(user.details.usertype == 'hotel' || !user.details.customer_id){
                return setErrorMsg('Only customer accounts can create reservations')
            }

            if(!pricingSelected){
                return setErrorMsg('No pricing plan selected')
            }

            // if(!accountnumber){
            //     return setErrorMsg('Cannot reserve a room because this hotel has not set their accout number')
            // }

            // if(checkIfReserved)
            
            return proceedToCheckout({
                roomDetails: {
                    hotel_id, 
                    room_id, 
                    pricingtype: pricingSelected.type, 
                    percentagediscount, 
                    price: Number(pricingSelected.value),
                    startdate: calendarValue,
                    customer_id: user.details.customer_id
                }
            })
        }

        const displayCatalogue = catalogue && catalogue.map((catalogueImg, i) => (
            <div className='col-lg-3'>
                <img src={catalogueImg} className='col-lg-12' />
            </div>
        ))

        const displayPricing = pricing.map((p, i) => {
            const { type, value } = p

            const discountValue = ((percentagediscount/100) * value)
            const actualValue = value - discountValue

            const selectPricing = () => {
                setDateConfirmed({ isLoading: false, errorMsg: null, isConfirmed: false })                
                setPricingSelected({
                    ...p, discountValue, actualValue
                })
                return setOpenCalendar(true)
            }

            return (
                <div className=''>
                    <div className='mb-2'>
                        <label for="customer" className="login-form-label text-capitalize">
                            <input 
                                type="radio" 
                                name="price" 
                                value="price"
                                className="mx-2"
                                style={{accentColor: '#FFB901'}}
                                onChange={selectPricing}
                            />
                            {type}
                        </label>  
                    </div> 
                    <div className='mx-2 mb-1'>
                        <p className='m-0 p-0 login-form-label'>Price: &#8358;{value}</p>
                    </div> 
                    {/* <div className='mx-2 mb-1'>
                        <p className='m-0 p-0 login-form-label'>Discount value: &#8358;{discountValue}</p>
                    </div>                                       */}
                    {/* <h6 className='m-0 p-0 mb-2 text-capitalize'>{type}</h6> */}
                </div>
            )
        })

        return (
            <Modal
                show={visible}
                onHide={hideBookingModal}
                size='xl'
                backdrop="static"
            >
                <Modal.Body className="m-0 p-0">
                    <div className="bottom-border mb-5">
                        <div className='p-3 d-flex justify-content-between'>
                            <div className='d-flex align-items-center mb-3'>
                                <div className='col-lg-3'>
                                    <img src={profileimg} className="rounded-3 col-lg-12" />
                                </div>
                                <div>
                                <div className='mx-3 h-100 left-border-light-thin px-3'>
                                    <p className={`p-0 m-0 mb-1 single-hotel-hotel-name`}>The {hotelname} Hotel</p>                                 
                                    <p className={`p-0 m-0 single-hotel-hotel-room-count`}>Room Reservation</p>
                                </div>                            
                                </div>
                            </div>
                            <div className="mx-2">
                                <ImCancelCircle 
                                    onClick={hideBookingModal}
                                    size={25} 
                                    color="#1F1F1F" 
                                    className="pointer" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className='px-2 py-2'>
                        <VerticalScroll defaultHeight={'60vh'}>
                            <div className='p-3'>
                                <div className='mb-3 border-bottom'>
                                    <h1 className='single-hotel-rooms-title'>Room details</h1>
                                </div>
                                <div className='d-flex justify-content-between align-items-center mb-5'>
                                    <div className='h-100 d-flex flex-column justify-content-between'>
                                        <div className="mb-3">
                                            <h6 className="m-0 p-0 mb-2 hotel-profile-info-house-rules-text-counter">
                                                Room Id
                                            </h6>
                                            <p className="mb-2 p-0 hotel-profile-info-house-rules-text">
                                                {room_id}
                                            </p>                                    
                                        </div>
                                        <div>
                                            <h6 className="m-0 p-0 mb-2 hotel-profile-info-house-rules-text-counter">
                                                Catalogue
                                            </h6>
                                        </div>
                                        <div className='d-flex flex-wrap col-lg-8'>
                                            {
                                                displayCatalogue
                                            }                                        
                                        </div>                            
                                    </div>
                                    <div>
                                        <img src={catalogue[0]} />
                                    </div>
                                </div>
                                <div className='mb-3 border-bottom'>
                                    <h1 className='single-hotel-rooms-title'>Room pricing</h1>
                                </div>
                                {/* <div className="mb-3">
                                    <h6 className="m-0 p-0 mb-2 hotel-profile-info-house-rules-text-counter">
                                        Percentage discount for all durations
                                    </h6>
                                    <p className="mb-2 p-0 hotel-profile-info-house-rules-text">
                                        {percentagediscount}%
                                    </p>                                    
                                </div>  */}
                                <div className="mb-3">
                                    <h6 className="m-0 p-0 mb-2 hotel-profile-info-house-rules-text-counter">
                                        Durations
                                    </h6>
                                    <div className='d-flex justify-content-between align-items-center h-100'>
                                        <div className="col-lg-7 d-flex h-100 flex-column justify-content-between">
                                            <div className='d-flex flex-wrap mb-4 justify-content-between'>
                                                {
                                                    displayPricing
                                                }                                        
                                            </div>
                                            <Collapse in={openCalendar}>
                                                <div>
                                                    <h6 className="m-0 p-0 mb-2 hotel-profile-info-house-rules-text-counter">
                                                        Select Date
                                                    </h6>
                                                    {
                                                       calendarValue && expiryDate && pricingSelected &&
                                                        <div className='mb-3'>
                                                            <h6>
                                                                <span className='single-hotel-hotel-room-count'>
                                                                    Starting:
                                                                </span>
                                                                <span className='login-form-label mx-2'>
                                                                    {calendarValue.toDateString()}
                                                                </span>
                                                            </h6>
                                                            <h6>
                                                                <span className='single-hotel-hotel-room-count'>
                                                                    Expiring:
                                                                </span>
                                                                <span className='login-form-label mx-2'>
                                                                    {expiryDate.toDateString()}
                                                                </span>
                                                            </h6> 
                                                            <hr /> 
                                                            <h6 className='login-form-label fst-italic'>
                                                                <span>
                                                                    <strong>Be advised: </strong>
                                                                    <span>
                                                                        This calendar is an estimate of free and reserved dates.
                                                                        All dates selected are to be confirmed after selection.
                                                                        Once confirmed, you can proceed irrespective of whether the calendar
                                                                        marks the date as free or reserved. If such is the case, refresh the page to rectify...
                                                                    </span>
                                                                </span>    
                                                            </h6>                                                                                                             
                                                        </div>                                                       
                                                    }                                                   
                                                    <div className='w-100'>
                                                        <Calendar 
                                                            className="w-100 single-hotel-background-hotel-info-container"
                                                            onChange={onChangeCalendarValue} 
                                                            value={calendarValue}
                                                            tileDisabled={({ date }) => checkIfReserved({ date })}
                                                        />
                                                    </div>                                                    
                                                </div>
                                            </Collapse>                                            
                                        </div>
                                        <div className='col-lg-4 d-flex flex-column align-items-center justify-content-between h-100'>
                                            {
                                                pricingSelected
                                                ?
                                                    <div className='w-100 py-2 h-100'>
                                                        <div className='single-hotel-background-hotel-info-container mb-5'>
                                                            <div>
                                                                <h6 className="m-0 p-0 mb-2 text-center border-bottom hotel-profile-info-house-rules-text-counter">Chosen pricing plan</h6>
                                                            </div>
                                                            <div className='p-3'>
                                                                <div className="d-flex justify-content-between">
                                                                    <h6 className='single-hotel-hotel-room-count'>Pricing type</h6>
                                                                    <p className='login-form-label text-capitalize'>{pricingSelected.type}</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between">
                                                                    <h6 className='single-hotel-hotel-room-count'>Face value price</h6>
                                                                    <p className='login-form-label'>{pricingSelected.value}</p>
                                                                </div> 
                                                                {/* <div className="d-flex justify-content-between">
                                                                    <h6 className='single-hotel-hotel-room-count'>Discount on face value price</h6>
                                                                    <p className='login-form-label'>{pricingSelected.discountValue}</p>
                                                                </div>  */}
                                                                <div className="d-flex justify-content-between">
                                                                    <h6 className='single-hotel-hotel-room-count'>Sub total</h6>
                                                                    <p className='login-form-label'>{pricingSelected.value}</p>
                                                                    {/* <p className='login-form-label'>{pricingSelected.actualValue}</p> */}
                                                                </div>                                                                                                                                                                                    
                                                            </div>
                                                        </div>
                                                        <div className='my-5'>
                                                            {
                                                                errorMsg
                                                                ?
                                                                    <p className="login-error-msg text-center my-2">
                                                                        <CustomErrorMsg errorMsg={errorMsg} noCenter={true} />
                                                                    </p>
                                                                :
                                                                    <></>                                    
                                                            }     
                                                            <h6 className="m-0 p-0 mb-2 text-center border-bottom hotel-profile-info-house-rules-text-counter">
                                                                {
                                                                    dateConfirmed && dateConfirmed.isConfirmed ? 'All set...?' : 'Confirm Date selected'
                                                                }
                                                            </h6>  
                                                            {
                                                                dateConfirmed && dateConfirmed.isConfirmed
                                                                ?
                                                                    <button
                                                                        onClick={checkout}
                                                                        className="login-form-btn w-100 p-3"
                                                                    >
                                                                        proceedToCheckout
                                                                    </button>
                                                                :
                                                                    <div>
                                                                        {
                                                                            dateConfirmed.errorMsg
                                                                            ?
                                                                                <p className="login-error-msg text-center my-2">
                                                                                    <CustomErrorMsg errorMsg={dateConfirmed.errorMsg} />
                                                                                </p>
                                                                            :
                                                                                <></>                                    
                                                                        }                                                                        
                                                                        <button
                                                                            onClick={confirmDateRequest}
                                                                            className="login-form-btn w-100 p-3"
                                                                            disabled={dateConfirmed.isLoading}
                                                                            style={{
                                                                                opacity: dateConfirmed.isLoading ? 0.76 : 1
                                                                            }}
                                                                        >
                                                                            {
                                                                                dateConfirmed.isLoading && <Spinner className='mx-2' size="sm" />
                                                                            }                                                                            
                                                                            {
                                                                                dateConfirmed.isLoading ? 'Confirming...' : 'Confirm'
                                                                            }
                                                                        </button>                                                                
                                                                    </div>
                                                            }                                                          
                                                        </div>                                                        
                                                    </div>
                                                :
                                                    <p className='hotel-edit-profile-room-number p-0 m-0 p-3'>Select a pricing plan</p>
                                            }
                                        </div>
                                    </div>                                  
                                </div>                                                                                                                                
                            </div> 
                        </VerticalScroll> 
                    </div>                
                </Modal.Body>
            </Modal>
        )
    } else{
        return <></>
    }
}