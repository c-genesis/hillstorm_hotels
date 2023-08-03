import React, { useEffect, useState } from 'react'
import ZeroItems from '../../ZeroItems/ZeroItems'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import ReactCardFlip from 'react-card-flip';
import { MdPendingActions } from 'react-icons/md'
import { AiFillCheckCircle, AiOutlineArrowDown } from 'react-icons/ai'
import { ImCancelCircle } from 'react-icons/im'
import { TbFilters } from 'react-icons/tb'
import { FiZoomIn } from 'react-icons/fi'
import { Modal, Spinner } from 'react-bootstrap';
import { QRCode } from 'react-qrcode-logo';
import dayjs from 'dayjs';
import CustomErrorMsg from '../../errorMessage/CustomErrorMsg';



export default function MyReservations({ 
    user_CP, roomReservations, showApproved, filter, setFilter, setRoomReservations, allReservations,
    showReservationId, setShowReservationId, reservationCardFlip, setReservationCardFlip, hotelCatalogue,
    showRoomCatalogueModal, hideRoomCatalogueModal, setShowRoomCatalogueModal, reservationIdModal,
    setReservationIdModal, hideReservationIdModal, secondaryFilter, setSecondaryFilter, showCancelled,
    editReservationReqs, setEditReservationReqs
 }){

    const isPending = !showApproved && !showCancelled
    const cancellationInitated = editReservationReqs ? editReservationReqs.isLoading : false

    useEffect(() => {
        if(user_CP.details){
            if(filter){
                const filteredReservations = allReservations.filter(r => 
                    r.room_id.toLowerCase().includes(filter) || filter.includes(r.room_id.toLowerCase())
                    ||
                    r.hotelname.toLowerCase().includes(filter) || filter.includes(r.hotelname.toLowerCase())
                    ||
                    r.hotel_id.toLowerCase().includes(filter) || filter.includes(r.hotel_id.toLowerCase())
                    ||
                    r.reservation_id.toLowerCase().includes(filter) || filter.includes(r.reservation_id.toLowerCase())
                )
                setRoomReservations(filteredReservations)
            } else{
                setRoomReservations(allReservations)
            }
        } else{
            setRoomReservations([])
        }
    }, [filter])   
    
    useEffect(() => {
        if(user_CP.details){
            if(secondaryFilter == 'valid'){
                const filteredReservationsByDate = allReservations.filter(r => {
                    const { expirydate } = r
                    return dayjs(new Date()).isBefore(new Date(expirydate), 'day')
                })
                setRoomReservations(filteredReservationsByDate)


            } else if(secondaryFilter == 'expired'){
                const filteredReservationsByDate = allReservations.filter(r => {
                    const { expirydate } = r
                    return dayjs(new Date()).isAfter(new Date(expirydate), 'day')
                })
                setRoomReservations(filteredReservationsByDate)


            } else{
                setRoomReservations(allReservations)
            }
        } else{
            setRoomReservations([])
        }
    }, [secondaryFilter])

    const onChangeFilter = e => {
        if(e){
            setFilter(e.target.value.toLowerCase())
        } else{
            setFilter('')
        }

        return
    }

    const displayRoomReservations = roomReservations && roomReservations.map((reservation, i) => {
        const { 
            catalogue, hotelname, rating, room_id, pricingtype, amountforhotel, servicefee,
            profileimg, startdate, expirydate, reservation_id, state, country, coverimg, house_rules_do,
            house_rules_dont, address, city
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
            return setReservationCardFlip({ id: i, isFlipped: true })
        }

        const reservationIdVisible = () => setShowReservationId({ visible: true, id: i })
        const reservationIdInVisible = () => setShowReservationId({ visible: false, id: i })

        const enlargeRoomCatalogue = () => setShowRoomCatalogueModal({ visible: true, roomDetails: reservation })
        const showQrCode = () => setReservationIdModal({ visible: true, code: reservation_id, hotelProfile: profileimg, hotelCover: coverimg })
        
        const initaiteReservationCancellation = () => {
            if(isPending){
                const refundtype = 
                    dayjs(new Date()).isBefore(new Date(startdate), 'day')
                    ?
                        'full'
                    :
                        'half'

                setEditReservationReqs({ 
                    isLoading: true, 
                    data: {
                        reservation_id,
                        status: 'cancelled',
                        refundtype
                    }, 
                    type: 'cancel',
                    errorMsg: null,
                    reservation
                })
                setShowReservationId({ visible: false, id: null })
            }

            return
        }

        const backView = (
            <div className='single-hotel-background-hotel-info-container'>
                <div className=''>
                    <div 
                        className='background-image mb-1 d-flex flex-column justify-content-between' 
                        style={{
                            backgroundImage: `url(${coverimg})`,
                            height: '40vh',
                            width: '100%'
                        }}
                    >
                        <div className='d-flex justify-content-end'>
                            <div className='col-lg-2 d-flex justify-content-end'>
                                <div 
                                    onClick={showCardFront}
                                    className='col-lg-10 p-1 rounded-border clickable'
                                >
                                    <img src={catalogue[0]} className='col-lg-12' />    
                                </div>
                            </div>
                        </div>
                        <div className='d-flex align-items-center p-2'>
                            <div className='col-lg-2'>
                                <img src={profileimg} className='col-lg-12 rounded-circle' />
                            </div>
                            <div className='mx-3 h-100 left-border-light-thin px-3'>
                                <p className={`p-0 m-0 user-profile-my-reservations-hotel-main-text`}>{hotelname}</p> 
                                <p className={`p-0 m-0 text-capitalize user-profile-my-reservations-hotel-sub-text`}>{state}, {country}</p>
                            </div>
                        </div>
                    </div>
                    <div className='p-2'>
                        <div className="mb-4">
                            <h6 className='d-flex justify-content-between'>
                                <span 
                                    className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1"
                                >
                                    Hotel information
                                </span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                                        <path d="M4.54894 0.802052C4.8483 -0.119259 6.1517 -0.11926 6.45106 0.802051L6.95934 2.36639C7.09321 2.77841 7.47717 3.05737 7.9104 3.05737H9.55524C10.524 3.05737 10.9267 4.29699 10.143 4.86639L8.81232 5.8332C8.46183 6.08785 8.31518 6.53922 8.44905 6.95124L8.95733 8.51558C9.25669 9.43689 8.20221 10.203 7.41849 9.63361L6.08779 8.6668C5.7373 8.41215 5.2627 8.41215 4.91221 8.6668L3.58151 9.63361C2.7978 10.203 1.74331 9.43689 2.04267 8.51558L2.55095 6.95124C2.68483 6.53922 2.53817 6.08785 2.18768 5.8332L0.856976 4.86639C0.0732617 4.29699 0.476037 3.05737 1.44476 3.05737H3.0896C3.52283 3.05737 3.90678 2.77841 4.04066 2.36639L4.54894 0.802052Z" fill="#FFB901"/>
                                    </svg>                        
                                    <span className="ms-2">
                                        {rating}
                                    </span>
                                </span>
                            </h6>
                        </div>
                        <div className=''>
                            <div className='px-3 mb-4'>
                                <h6 className='single-hotel-hotel-room-count text-center pb-3 border-bottom'>
                                    House rules
                                </h6>
                                <div className="d-flex align-items-center justify-content-between">
                                    <h6 className="hotel-profile-info-house-rules-header-text p-0 m-0 mb-2">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 37 37" fill="none">
                                                <path d="M15.7913 25.151L9.25 18.6082L11.4299 16.4283L15.7913 20.7881L24.511 12.0669L26.6924 14.2484L15.7913 25.1479V25.151Z" fill="#3CD623"/>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.54175 18.4998C1.54175 9.13421 9.13446 1.5415 18.5001 1.5415C27.8657 1.5415 35.4584 9.13421 35.4584 18.4998C35.4584 27.8655 27.8657 35.4582 18.5001 35.4582C9.13446 35.4582 1.54175 27.8655 1.54175 18.4998ZM18.5001 32.3748C16.678 32.3748 14.8737 32.016 13.1903 31.3187C11.507 30.6214 9.97739 29.5994 8.68897 28.3109C7.40056 27.0225 6.37854 25.493 5.68125 23.8096C4.98397 22.1262 4.62508 20.3219 4.62508 18.4998C4.62508 16.6777 4.98397 14.8735 5.68125 13.1901C6.37854 11.5067 7.40056 9.97714 8.68897 8.68873C9.97739 7.40032 11.507 6.37829 13.1903 5.68101C14.8737 4.98372 16.678 4.62484 18.5001 4.62484C22.18 4.62484 25.7091 6.08666 28.3112 8.68873C30.9133 11.2908 32.3751 14.82 32.3751 18.4998C32.3751 22.1797 30.9133 25.7089 28.3112 28.3109C25.7091 30.913 22.18 32.3748 18.5001 32.3748Z" fill="#3CD623"/>
                                            </svg>                                            
                                        </span>
                                        <span className="mx-2">
                                            Do's
                                        </span>
                                    </h6>                                    
                                    <p className='login-form-label text-capitalize'>{house_rules_do.length} rules</p>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <h6 className="hotel-profile-info-house-rules-header-text p-0 m-0 mb-2">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 38 38" fill="none">
                                                <path d="M18.75 1.42188C9.04175 1.42188 1.17188 9.29175 1.17188 19C1.17188 28.7083 9.04175 36.5781 18.75 36.5781C28.4583 36.5781 36.3281 28.7083 36.3281 19C36.3281 9.29175 28.4583 1.42188 18.75 1.42188ZM18.75 5.81641C26.031 5.81641 31.9336 11.719 31.9336 19C31.9336 26.281 26.031 32.1836 18.75 32.1836C11.469 32.1836 5.56641 26.281 5.56641 19C5.56641 11.719 11.469 5.81641 18.75 5.81641ZM12.8448 10.2109C12.7738 10.2106 12.6979 10.2191 12.6205 10.2339V10.2315C11.2804 10.4832 9.30527 12.7762 10.176 13.6465L15.5342 19.0023L10.1761 24.3583C9.10459 25.4294 12.3203 28.6454 13.3919 27.574L18.75 22.2158L24.1081 27.5739C25.1796 28.6453 28.3955 25.4293 27.3239 24.3581L21.9658 19.0023L27.3239 13.6465C28.3954 12.5753 25.1797 9.36184 24.1081 10.433L18.75 15.7888L13.3919 10.433C13.241 10.2832 13.0579 10.2122 12.8448 10.2111L12.8448 10.2109Z" fill="#FF1616"/>
                                            </svg>                                           
                                        </span>
                                        <span className="mx-2">
                                            Dont's
                                        </span>
                                    </h6>                                    
                                    <p className='login-form-label text-capitalize'>{house_rules_dont.length} rules</p>
                                </div>                                
                            </div>
                            <div className='px-3 mb-4'>
                                <h6 className='single-hotel-hotel-room-count text-center pb-3 border-bottom'>
                                    Hotel Location
                                </h6>
                                <p className='login-form-label text-capitalize'>
                                    {country}; {state}; {city}; {address}
                                </p>
                            </div>
                            <div className='mb-3'>
                                <p className='login-form-label m-0 p-0'>
                                    To see house rules, hotel background information and others
                                    <span>
                                        <AiOutlineArrowDown color="#1F1F1F" className='mx-2' size={15} />
                                    </span>
                                </p>
                            </div>
                            <div className='px-3'>
                                <button
                                    className="login-form-btn w-100 p-3"
                                >
                                    View Hotel
                                </button>
                            </div>
                        </div>                                                     
                    </div>
                </div>
            </div>                
        )

        const frontView = (
            <div className="single-hotel-background-hotel-info-container">                  
                <div className=''>
                    <div className='d-flex justify-content-center mb-1'>
                        <div 
                            className='background-image' 
                            style={{
                                backgroundImage: 
                                    edittingThisReservation 
                                    ?
                                        `linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), 
                                            url(${catalogue[0]})`
                                    :
                                        `url(${catalogue[0]})`
                                ,
                                height: '40vh',
                                width: '100%'
                            }}
                        >
                            <div className='d-flex align-items-start justify-content-end mb-5'>
                                <div className='col-lg-2 d-flex justify-content-end'>
                                    <div 
                                        onClick={showCardBack}
                                        className='col-lg-10 p-1 rounded-border rounded-circle clickable'
                                    >
                                        <img src={profileimg} className='col-lg-12 rounded-circle' />    
                                    </div>
                                </div>
                            </div>
                            {
                                edittingThisReservation &&
                                    <div className='d-flex flex-column align-items-center'>
                                        <Spinner 
                                            className='p-3 mb-1' 
                                            style={{
                                                color: '#FFFFFF',
                                                opacity: 0.23
                                            }} 
                                        />
                                        <p style={{color: '#FFF'}} className='login-form-label m-0 p-0'>
                                            Cancelling...
                                        </p>
                                    </div>                                
                            }
                        </div>
                    </div>
                    <div className='p-2'>
                        <div className="mb-4">
                            <h6 className='d-flex justify-content-between'>
                                <span 
                                    className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1"
                                >
                                    Room information
                                </span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                                        <path d="M4.54894 0.802052C4.8483 -0.119259 6.1517 -0.11926 6.45106 0.802051L6.95934 2.36639C7.09321 2.77841 7.47717 3.05737 7.9104 3.05737H9.55524C10.524 3.05737 10.9267 4.29699 10.143 4.86639L8.81232 5.8332C8.46183 6.08785 8.31518 6.53922 8.44905 6.95124L8.95733 8.51558C9.25669 9.43689 8.20221 10.203 7.41849 9.63361L6.08779 8.6668C5.7373 8.41215 5.2627 8.41215 4.91221 8.6668L3.58151 9.63361C2.7978 10.203 1.74331 9.43689 2.04267 8.51558L2.55095 6.95124C2.68483 6.53922 2.53817 6.08785 2.18768 5.8332L0.856976 4.86639C0.0732617 4.29699 0.476037 3.05737 1.44476 3.05737H3.0896C3.52283 3.05737 3.90678 2.77841 4.04066 2.36639L4.54894 0.802052Z" fill="#FFB901"/>
                                    </svg>                        
                                    <span className="ms-2">
                                        {rating}
                                    </span>
                                </span>
                            </h6>
                        </div>
                        {
                            !showCancelled &&
                                <div className='pb-3 border-bottom mb-3'>
                                    <p className='m-0 p-0 mb-2 login-form-label'>
                                        Room Id: 
                                        <span className='mx-2'>
                                            {room_id}
                                        </span>
                                    </p>
                                    <p className='m-0 p-0 login-form-label d-flex flex-wrap justify-content-between'>
                                        <span className='wrap-text col-lg-11'>
                                            Reservation Id: 
                                            <span className='mx-2'>
                                                { 
                                                    showReservationId.id == i && showReservationId.visible
                                                    ? 
                                                        <span>
                                                            { reservation_id }
                                                            <span
                                                                onClick={showQrCode} 
                                                                style={{
                                                                    textDecorationLine: 'underline', 
                                                                    textDecorationColor: '#FFB901' ,
                                                                    fontSize: '13px'
                                                                }} 
                                                                className='clickable fst-italic mx-4 single-hotel-hotel-room-count'>
                                                                show QR code
                                                            </span>
                                                        </span>
                                                    : 
                                                        '**********' 
                                                }
                                            </span>
                                        </span>
                                        <span className='col-lg-1'>
                                            {
                                                showReservationId.id == i && showReservationId.visible
                                                ?  
                                                    <button
                                                        className='rounded-circle bg-transparent' 
                                                        onClick={reservationIdInVisible}
                                                        disabled={cancellationInitated}
                                                        style={{
                                                            opacity: cancellationInitated ? 0.56 : 1
                                                        }}
                                                    >
                                                        <AiFillEyeInvisible size={20} color='#FFB901' />
                                                    </button>
                                                :
                                                    <button
                                                        className='rounded-circle bg-transparent' 
                                                        onClick={reservationIdVisible}
                                                        disabled={cancellationInitated}
                                                        style={{
                                                            opacity: cancellationInitated ? 0.56 : 1
                                                        }}                                                
                                                    >
                                                        <AiFillEye size={20} color='#FFB901' />
                                                    </button>
                                            }
                                        </span>
                                    </p>                            
                                </div>
                        }
                        <div className=' mb-4'>
                            <div className='px-3'>
                                <div className="d-flex justify-content-between">
                                    <h6 className='single-hotel-hotel-room-count'>Pricing type</h6>
                                    <p className='login-form-label text-capitalize'>{pricingtype}</p>
                                </div>
                                <div className="d-flex justify-content-between">
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
                        <div className='px-3 mb-2'>
                            <h6 className='single-hotel-hotel-room-count text-center pb-3 border-bottom'>
                                Room Catalogue
                            </h6>
                            <div className='mb-1 d-flex align-items-center justify-content-between'>
                                {
                                    catalogue.map((catalogueImg, i) => (
                                        <div className='col-lg-2'>
                                            <img alt="#" src={catalogueImg} className='col-lg-12' />
                                        </div>
                                    ))
                                }
                                <div className='d-flex col-lg-4 justify-content-end'>
                                    <button 
                                        className="col-lg-10 py-2 gray-button single-hotel-additional-rooms-container d-flex align-items-center justify-content-center"
                                        onClick={enlargeRoomCatalogue}
                                        disabled={cancellationInitated}
                                        style={{
                                            opacity: cancellationInitated ? 0.56 : 1
                                        }}
                                    >
                                        <p className="m-0 p-0 single-hotel-additional-text">
                                            <span className=''>
                                                <FiZoomIn size={20} color="#1F1F1F" />
                                            </span>
                                        </p>
                                    </button>
                                </div>
                            </div>
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
                        {
                            isPending && editReservationReqs.errorMsg && editReservationReqs.reservation_id == reservation_id
                            ?
                                <p className="login-error-msg text-center my-2">
                                    <CustomErrorMsg errorMsg={editReservationReqs.errorMsg} />
                                </p>
                            :
                                <></>                                    
                        }
                    </div>
                </div>                  
            </div>                
        )

        return (
            <div key={i} className='col-lg-3 mb-2 mx-4'>
                <ReactCardFlip 
                    isFlipped={
                        reservationCardFlip.id == i ?
                            reservationCardFlip.isFlipped
                        :
                            false
                    } 
                    flipDirection="horizontal"
                >
                    <div>
                        { frontView }
                    </div>

                    <div>
                        { backView }
                    </div>
                </ReactCardFlip>
            </div>
        )
    })

    return (
        <div>
            <div>
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="col-lg-6">
                        {
                            showApproved 
                            ?
                                <div>
                                    <h4 className="single-hotel-rooms-title p-0 m-0 mb-3">
                                        <span>
                                            <AiFillCheckCircle color='#1F1F1F' size={30} />
                                            <span className='mx-1'>Enrolled reservations</span>
                                        </span>                                     
                                    </h4>
                                    <div className='d-flex mb-4'>
                                        <button
                                            onClick={() => setSecondaryFilter('valid')}
                                            style={{
                                                backgroundColor: '#FFF',
                                                opacity: secondaryFilter == 'valid' ? 1 : 0.46
                                            }} 
                                            className='single-hotel-filter-rooms-input py-2 px-2 gray-button'
                                        >
                                            <p className='custom-placeholder m-0 p-0 d-flex align-items-center'>
                                                {
                                                    secondaryFilter == 'valid' &&
                                                        <TbFilters size={20} color="#1F1F1F" className='mx-1 hover-rotate' />
                                                }
                                                <span>
                                                    Checked In
                                                </span>
                                            </p>
                                        </button>
                                        <button 
                                            onClick={() => setSecondaryFilter('expired')}
                                            style={{
                                                backgroundColor: '#FFF',
                                                opacity: secondaryFilter == 'expired' ? 1 : 0.46
                                            }}                                        
                                            className='mx-2 single-hotel-filter-rooms-input py-2 px-2 gray-button'
                                        >
                                            <p className='custom-placeholder m-0 p-0 d-flex align-items-center'>
                                                {
                                                    secondaryFilter == 'expired' &&
                                                        <TbFilters size={20} color="#1F1F1F" className='mx-1 hover-rotate' />
                                                }  
                                                <span>
                                                    Checked Out
                                                </span>                                              
                                            </p>
                                        </button>                                        
                                    </div> 
                                    <div>
                                        <p className="m-0 p-0 login-form-label">
                                            {
                                                secondaryFilter == 'valid'
                                                ?
                                                    <span>
                                                        Showing reservations which you are currently occupying
                                                    </span>
                                                :
                                                    <span>
                                                        Show reservations which you have occupied before
                                                    </span>
                                            }
                                        </p>
                                    </div>                                                                       
                                </div>
                            :
                            showCancelled
                            ?
                                <div>
                                    <h4 className="single-hotel-rooms-title p-0 m-0 mb-4">
                                        <span>
                                            <ImCancelCircle color='#1F1F1F' size={30} />
                                            <span className='mx-1'>Cancelled reservations</span>
                                        </span>
                                    </h4>
                                    <div>
                                        <p className="m-0 p-0 login-form-label">
                                            Showing all cancelled reservations.
                                            <br /> Reservations you received a refund after cancelling
                                            <hr />
                                            <span>
                                                <strong>Be advised:</strong> 
                                                Kindly contact support@hillstourhomes.com for any of these you did not receive a refund for
                                            </span>
                                        </p>
                                    </div>                                    
                                </div>                                    
                            :
                                <div>
                                    <h4 className="single-hotel-rooms-title p-0 m-0 mb-3">
                                        <span>
                                            <MdPendingActions color='#1F1F1F' size={30} />
                                            <span className='mx-1'>Pending reservations</span>
                                        </span>
                                    </h4>
                                    <div className='d-flex mb-4'>
                                        <button
                                            disabled={cancellationInitated}
                                            onClick={() => setSecondaryFilter('valid')}
                                            style={{
                                                backgroundColor: '#FFF',
                                                opacity: secondaryFilter == 'valid' || cancellationInitated ? 1 : 0.46
                                            }} 
                                            className='single-hotel-filter-rooms-input py-2 px-2 gray-button'
                                        >
                                            <p className='custom-placeholder m-0 p-0 d-flex align-items-center'>
                                                {
                                                    secondaryFilter == 'valid' &&
                                                        <TbFilters size={20} color="#1F1F1F" className='mx-1 hover-rotate' />
                                                }
                                                <span>
                                                    Awaiting
                                                </span>
                                            </p>
                                        </button>
                                        <button 
                                            onClick={() => setSecondaryFilter('expired')}
                                            disabled={cancellationInitated}                                            
                                            style={{
                                                backgroundColor: '#FFF',
                                                opacity: secondaryFilter == 'expired' || cancellationInitated ? 1 : 0.46
                                            }}                                        
                                            className='mx-2 single-hotel-filter-rooms-input py-2 px-2 gray-button'
                                        >
                                            <p className='custom-placeholder m-0 p-0 d-flex align-items-center'>
                                                {
                                                    secondaryFilter == 'expired' &&
                                                        <TbFilters size={20} color="#1F1F1F" className='mx-1 hover-rotate' />
                                                }  
                                                <span>
                                                    Time expired
                                                </span>                                              
                                            </p>
                                        </button>                                        
                                    </div>
                                    <div>
                                        <p className="m-0 p-0 login-form-label">
                                            {
                                                secondaryFilter == 'valid'
                                                ?
                                                    <span>
                                                        <span>
                                                            Showing all pending reservations that are still valid.
                                                            <br />Cancel now to get a refund of your cash paid during reservation
                                                        </span>
                                                        <br />
                                                        <hr />
                                                        <span className="">
                                                            <strong>Be advised:</strong> If you cancel a reservation when the startdate of such reservation has begun,
                                                            you will only receive 50% refund of your cash paid when you created the reservation
                                                        </span>                                                    
                                                    </span>                                                    
                                                :
                                                    <span>
                                                        Showing all pending reservations whose duration has elapsed. 
                                                        <br/>Refunds are not allowed for such reservations.
                                                    </span>
                                            }
                                        </p>
                                    </div>
                                </div>
                        }
                    </div>                    
                    <div className="d-flex mb-4 align-items-center col-lg-6 justify-content-end">
                        <p className="single-hotel-filter-rooms-label-text m-0 p-0 text-end w-25">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                                <path d="M3.81787 2.45459L3.81787 22.5003" stroke="black" stroke-width="1.90912" stroke-linecap="round"/>
                                <path d="M14.2732 22.5005L14.2732 1.50021" stroke="black" stroke-width="1.90912" stroke-linecap="round"/>
                                <circle cx="3.81823" cy="16.7733" r="3.81823" fill="black"/>
                                <circle cx="3.34095" cy="3.34095" r="3.34095" transform="matrix(1 0 0 -1 10.4546 11.0454)" fill="black"/>
                            </svg>
                            <span className="mx-2">search filter</span>
                        </p>
                        <input 
                            type="text"
                            onChange={onChangeFilter}
                            value={filter}
                            style={{
                                opacity: cancellationInitated ? 0.76 : 1
                            }}
                            disabled={cancellationInitated}
                            placeholder={cancellationInitated ? 'cancellation in progress. cannot filter' : 'filter: hotel name or room id or reservation id...'}
                            className="w-75 single-hotel-filter-rooms-input py-2 px-2"
                        />
                    </div>                     
                </div>
                {
                    roomReservations && roomReservations.length > 0
                    ?
                        <div>                               
                            <div className='d-flex w-100 flex-wrap'>
                                {
                                    displayRoomReservations
                                }
                            </div>
                        </div>
                    :
                        <div>
                            <ZeroItems zeroText={'Zero reservations found'} />
                        </div>
                }
            </div>

            <Modal
                show={showRoomCatalogueModal.visible}
                onHide={hideRoomCatalogueModal}
                size="xl"
            >
                <Modal.Body
                    className="m-0 px-3"
                >
                    <div className="d-flex justify-content-between">
                        <div className='d-flex align-items-center mb-3'>
                            <div>
                                <img src={showRoomCatalogueModal.roomDetails.profileimg} className="rounded-circle" />
                            </div>
                            <div>
                            <div className='mx-3 h-100 left-border-light-thin px-3'>
                                <p className={`p-0 m-0 mb-1 single-hotel-hotel-name`}>The {showRoomCatalogueModal.roomDetails.hotelname} Hotel</p>                                 
                                <p className={`p-0 m-0 single-hotel-hotel-room-count`}>showing room catalogue</p>
                            </div>                            
                            </div>
                        </div>
                        <div className="mx-2">
                            <ImCancelCircle 
                                onClick={hideRoomCatalogueModal}
                                size={25} 
                                color="#1F1F1F" 
                                className="pointer" 
                            />
                        </div>
                    </div>
                    <div className="d-flex flex-wrap justify-content-center">
                        {
                            showRoomCatalogueModal.roomDetails.catalogue &&
                                showRoomCatalogueModal.roomDetails.catalogue.map((catalogueImg, i) => (
                                    <div className='col-lg-3' key={i}>
                                        <img alt="#" src={catalogueImg} className='col-lg-12' />
                                    </div>
                                ))
                        }
                    </div>
                </Modal.Body>
            </Modal>    

            <Modal
                show={reservationIdModal.visible}
                onHide={hideReservationIdModal}
                size="sm"            
            >
                <Modal.Body 
                    style={{
                        backgroundImage: `
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)), 
                            url(${reservationIdModal.hotelCover})
                        `,
                    }}
                    className='m-0 p-0 d-flex justify-content-center rounded-3 border-0'
                >
                    <div
                        onClick={hideReservationIdModal}
                        className='p-0 m-0'
                    >
                        <QRCode                         
                            size={250}
                            value={reservationIdModal.code} 
                            logoImage={reservationIdModal.hotelProfile}
                            bgColor='transparent'
                            fgColor='#000'
                        />
                    </div>                    
                </Modal.Body>
            </Modal>          
        </div>
    )
}