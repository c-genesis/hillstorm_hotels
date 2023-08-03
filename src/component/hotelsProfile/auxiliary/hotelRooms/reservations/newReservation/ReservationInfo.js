import React, { useEffect, useState, useRef } from 'react'
import { CgArrowLongRight } from 'react-icons/cg'
import Loading from '../../../../../loading/Loading'
import dayjs from 'dayjs'
import { Spinner } from 'react-bootstrap'
import { requestApi } from '../../../../../apiRequests/requestApi'
import CustomErrorMsg from '../../../../../errorMessage/CustomErrorMsg'
import { AiFillCheckCircle } from 'react-icons/ai'
import { IoChevronBackOutline } from 'react-icons/io5'
import { BsArrowRight } from 'react-icons/bs'
import DefaultPricing from './DefaultPricing'
import { CSSTransition } from 'react-transition-group'
import CustomPricing from './CustomPricing'




export default function ReservationInfo({ 
    selectedRoom, accessToken, goToCustomerInfo, setReservationDetails
}){
    const customPricingRef = useRef(null)

    const [showDefaultPricing, setShowDefaultPricing] = useState(true)
    const [showCustomPricing, setShowCustomPricing] = useState(false)

    const [pricingSelected, setPricingSelected] = useState()
    const [expiryDate, setExpiryDate] = useState()
    const [startDate, setStartDate] = useState()
    const [dateConfirmed, setDateConfirmed] = useState(false)
    const [reservationReqs, setReservationReqs] = useState({ isLoading: false, data: null, errorMsg: null })

    const goToFinalize = () => {
        if(selectedRoom){
            const { value, len } = pricingSelected
            const { room_id, hotel_id } = selectedRoom
            const reservation = {
                room_id, 
                hotel_id, 
                pricingtype: len, 
                amountforhotel: value,
                startdate: startDate,
                expiryDate: expiryDate,
                servicefee: 0,
                status: 'pending',
                refundtype: null,
                enrollingfrom: 'hotel'
            }
            setReservationDetails(reservation)
        }
    }

    const headToCustomerInfo = () => {
        setDateConfirmed(false)
        return goToCustomerInfo()
    }

    const goToDefaultPricing = () => {
        reset()
        setShowCustomPricing(false)

        return 
    }
    const goToCustomPricing = () => {
        reset()
        setShowCustomPricing(true)
        
        return
    }

    const reset = () => {
        setPricingSelected()
        setDateConfirmed(false)
        setStartDate(null)
        setExpiryDate(null)
        setReservationReqs({ isLoading: false, data: null, errorMsg: null })

        return;
    }

    useEffect(() => {
        if(pricingSelected){
            const { len, s_date, add, value } = pricingSelected
            updateDuration({ length: len, starting: s_date, toAdd: add })
        } else{
            reset()
        }
    }, [pricingSelected])   

    const updateDuration = ({ length, starting, toAdd }) => {
        if(length && starting && toAdd){
            const expiring = starting && length ? dayjs(starting).add(toAdd, length == 'custom' ? 'day' : length).toDate() : ''
            setStartDate(starting)
            setExpiryDate(expiring)
        }

        return setDateConfirmed(false)
    }

    if(selectedRoom){
        const { catalogue, pricing, hotel_id, room_id } = selectedRoom

        const confirmDateRequest = async () => {
            if(pricingSelected && startDate && expiryDate){
                
                setReservationReqs({ isLoading: true, data: null, errorMsg: null })     

                const { length, toAdd } = pricingSelected                

                const requestBody = {
                    length,
                    toAdd,
                    startDate,
                    hotel_id,
                    room_id
                }

                const confirmingDate = await requestApi({ url: 'users/confirm-reservation-date', method: 'post', token: accessToken, data: requestBody})
                const { responseStatus, result, errorMsg } = confirmingDate
                if(responseStatus){
                    const { isReserved, isInThePast } = result
                    if(isInThePast){
                        setReservationReqs({ 
                            isLoading: false, 
                            errorMsg: 'Date selected is in the past',
                            data: null
                        })
                        setDateConfirmed(false)                    
                    } else if(isReserved){
                        setReservationReqs({ 
                            isLoading: false, 
                            errorMsg: 'Time frame selected clashes with that of another customer. Either change room or change time selected', 
                            data: null
                        })
                        setDateConfirmed(false)
                    } else{
                        setReservationReqs({ isLoading: false, errorMsg: null, data: null})
                        setDateConfirmed(true)
                    }
                } else{
                    setReservationReqs({ isLoading: false, errorMsg: errorMsg.error,  data: null})
                    setDateConfirmed(false)
                }
    
                return
            }
    
            setDateConfirmed(false)
            return setReservationReqs({ isLoading: false, errorMsg: 'Something went wrong, try again later...!', data: null })
        }         

        const displayCatalogue = catalogue && catalogue.map((catalogueImg, i) => (
            <img className='col-lg-3' src={catalogueImg} />
        ))
     

        return (
            <div>
                <div className='d-flex align-items-center mb-3 justify-content-start'>                    
                    <button 
                        onClick={headToCustomerInfo}
                        className="login-form-btn p-3 gray-button"
                        style={{
                            backgroundColor: 'transparent'
                        }}
                    >
                        <IoChevronBackOutline 
                            color="#1F1F1F"
                            size={30} 
                        />  
                        <span className="m-0 p-0 login-form-label mx-2">
                            wrong customer?
                        </span>
                    </button>                         
                </div>                
                <div className='d-flex justify-content-center mb-4'>
                    <h4 className='clickable col-lg-7 pb-2 hotel-profile-main-admin-profile-header bottom-border text-center'>
                        Reservation Details
                    </h4>
                </div>
                <div className='mb-5'>
                    <h6 className="single-hotel-filter-rooms-label-text m-0 p-0 left-border px-3 mb-4">
                        Room Information
                    </h6>
                    <div className='d-flex justify-content-between flex-wrap align-items-center'>
                        <div className='col-lg-4'>
                            <h4 className="login-form-label mb-2">
                                Catalogue
                                <span className='mx-2'>
                                    <CgArrowLongRight size={20} color="1F1F1F" />
                                </span>
                            </h4>
                        </div>
                        <div className='col-lg-7 d-flex justify-content-end'>
                            { displayCatalogue }
                        </div>
                    </div>
                </div> 
                <div className=''>
                    {
                        showDefaultPricing &&
                            <div className='mb-5'>
                                <DefaultPricing 
                                    pricing={pricing}
                                    selectedRoom={selectedRoom}
                                    expiryDate={expiryDate}
                                    setPricingSelected={setPricingSelected}
                                    pricingSelected={pricingSelected}
                                    goToCustomPricing={goToCustomPricing}
                                />
                            </div>                        
                    }
                    <CSSTransition
                        in={showCustomPricing}
                        nodeRef={customPricingRef}
                        timeout={500}
                        classNames="alert"
                        unmountOnExit
                        onEnter={() => setShowDefaultPricing(false)}
                        onExited={() => setShowDefaultPricing(true)}                    
                    >
                        <div ref={customPricingRef} className='mb-4'>
                            <CustomPricing 
                                goToDefaultPricing={goToDefaultPricing}
                                setPricingSelected={setPricingSelected}
                                pricingSelected={pricingSelected}
                            />
                        </div>
                    </CSSTransition>
                </div>
                <div>
                    {
                        dateConfirmed
                        ?
                            <div>
                                <div className='d-flex justify-content-center mb-4'>
                                    <h6 className='pb-2 col-lg-5 bottom-border text-center'>
                                        <span className='mx-2'>
                                            <AiFillCheckCircle size={20} color='#1F1F1F' />
                                        </span>
                                        Date confirmed
                                    </h6>
                                </div>
                                <button
                                    onClick={goToFinalize}
                                    className="login-form-btn p-3"
                                >
                                    Continue 
                                    <span className="mx-2">
                                        <BsArrowRight size={20} />
                                    </span>                                     
                                </button>                                            
                            </div>
                        :
                        startDate && expiryDate &&
                            <div>
                                {
                                    reservationReqs.errorMsg
                                    ?
                                        <p className="login-error-msg text-center my-2">
                                            <CustomErrorMsg errorMsg={reservationReqs.errorMsg} />
                                        </p>
                                    :
                                        <></>                                    
                                }                                             
                                <button
                                    onClick={confirmDateRequest}
                                    className="login-form-btn p-3"
                                    disabled={reservationReqs.isLoading ? true : false}
                                    style={{
                                        opacity: reservationReqs.isLoading ? 0.76 : 1
                                    }}
                                >
                                    <span>
                                        { reservationReqs.isLoading && <Spinner size="sm" className="mx-2" /> }
                                    </span>                                
                                    <span>
                                        { reservationReqs.isLoading ? 'Confirming' : 'Confirm Date' }
                                    </span>
                                </button>    
                            </div>                                
                    }
                </div>                             
            </div>
        )
    } else{
        return <Loading loadingText={'something went wrong'} />
    }
}