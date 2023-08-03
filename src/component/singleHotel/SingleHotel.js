import React, { useEffect, useState } from "react";
import NoState from "../noState/NoState";
import './css/singleHotel.css'
import { Modal, Spinner } from "react-bootstrap";
import { ImCancelCircle } from 'react-icons/im'
import ZeroItems from "../ZeroItems/ZeroItems";
import Nav from "../pageone/nav/nav";
import ratting from '../../images/ratting.svg';
import styles from '../pageone/trend/trend.module.css'
import logo from '../../images/logos/LogoBlock.svg'
import BookRoom from "../bookings/BookRoom";
import VerticalScroll from "../scroll/VerticalScroll";
import { PaystackButton } from "react-paystack"
import { requestApi } from "../apiRequests/requestApi";
import CustomErrorMsg from "../errorMessage/CustomErrorMsg";
import { getDatesRange } from "../globals/globals";
import { useParams } from "react-router-dom";
import Loading from "../loading/Loading";


const PUBLIC_KEY = 'pk_test_77b7c00c5d7243d94da713ca2c6815eae23f99a5'



export default function SingleHotel({ 
    activeHotel, user, setUser, navigateTo, allHotels, accessToken, setActiveHotel
}){  

    const { active_hotel_id } = useParams()

    const hotelAvailable = 
        activeHotel
        ?
            activeHotel.hotelDetails
            ?
                true
            :
                false
        :
            false    

    const [hotel, setHotel] = useState()
    const [filteredHotelRooms, setFilteredHotelRooms] = useState([])
    const [filter, setFilter] = useState('')

    const [pricingSelected, setPricingSelected] = useState()
    const [calendarValue, onChangeCalendarValue] = useState(new Date())
    const [openCalendar, setOpenCalendar] = useState(false)

    const [mergedCatalogue, setMergedCatalogue] = useState([])
    const [mergedModal, setMergedModal] = useState()
    const [bookingModal, setBookingModal] = useState({ visible: false, roomDetails: '' })
    const [checkoutModal, setCheckoutModal] = useState({ visible: false, roomDetails: {} })

    const [errorMsg, setErrorMsg] = useState()
    const [paymentReqs, setPaymentReqs] = useState({ isLoading: false, errorMsg: null })
    const [dateConfirmed, setDateConfirmed] = useState({ isLoading: false, errorMsg: errorMsg, isConfirmed: false})

    const hideMergedModal = () => setMergedModal(false)
    const hideBookingModal = () => {
        setBookingModal({ visible: false, roomDetails: '' })
        setDateConfirmed({ errorMsg: null, isLoading: false, isConfirmed: false })
        setOpenCalendar(false)
        return setPricingSelected()
    }
    const hideCheckoutModal = (cancelled) => {
        setCheckoutModal({ visible: false, roomDetails: {} })
        setPaymentReqs({ isLoading: false, errorMsg: null })
        setDateConfirmed({ errorMsg: null, isLoading: false, isConfirmed: false })
        if(cancelled){
            setUser(prev => ({
                ...prev,
                alertModal: { message: 'Room reservation process terminated', duration: 3000 }
            }))
        }
        return;
    }

    useEffect(() => {
        initializeHotels()
    }, [allHotels, activeHotel])

    useEffect(() => {
        if(calendarValue){
            setDateConfirmed({ isLoading: false, errorMsg: null, isConfirmed: false })
        }
    }, [calendarValue])

    useEffect(() => {
        if(paymentReqs.isLoading){
            createRoomReservation({ requestBody: checkoutModal.roomDetails })
        }
    }, [paymentReqs])

    useEffect(() => {
        if(filter && hotelAvailable){
            setFilteredHotelRooms(
                activeHotel.hotelDetails.hotelRooms.filter(room => 
                    room.room_id.toLowerCase().includes(filter.toLowerCase())
                    ||
                    filter.toLowerCase().includes(room.room_id.toLowerCase())
                )
            )
        } else{
            setFilteredHotelRooms(hotelAvailable ? activeHotel.hotelDetails.hotelRooms : [])
        }
    }, [filter])

    const initializeHotels = () => {
        if(allHotels && allHotels.data){
            if(activeHotel){
                if(activeHotel.hotelDetails){
                    const merged = activeHotel.hotelDetails.hotelRooms.map(room => room.catalogue.flat())
                    setMergedCatalogue(merged.flat())
        
                    setFilteredHotelRooms(
                        activeHotel.hotelDetails.hotelRooms.filter(room => 
                            room.room_id.toLowerCase().includes(filter.toLowerCase())
                            ||
                            filter.toLowerCase().includes(room.room_id.toLowerCase())
                        )
                    )
    
                    return setHotel(activeHotel.hotelDetails)
                }
            }
    
            if(active_hotel_id){
                const setAsActive = allHotels.data.filter(hotel => hotel.hotel_id == active_hotel_id)
                return setActiveHotel({
                    roomIdSelected: null, hotelDetails: setAsActive[0], newRoute: null               
                })
    
            } else{
                return setUser(prev => ({
                    ...prev,
                    alertModal: {message: 'invalid hotel id in parameters, redirecting to home page'},
                    newRoute: '/'
                }))
            }
        }
    }

    const onChangeFilter = e => e && setFilter(e.target.value)

    const proceedToCheckout = ({ roomDetails }) => {
        hideBookingModal()
        return setCheckoutModal({ visible: true, roomDetails })
    }

    const createRoomReservation = async ({ requestBody }) => {
        const reservedRoom = await requestApi({ url: 'users/customers/create-reservation', method: 'post', data: requestBody, token: accessToken })
        const { responseStatus, result, errorMsg } = reservedRoom
        if(responseStatus){
            const { data } = result
            const { room_id } = data
            const filteredHotelRoom = activeHotel.hotelDetails.hotelRooms.filter(room => room.room_id == room_id)
            const newReservation = {
                ...data,
                ...activeHotel.hotelDetails,
                ...filteredHotelRoom[0],
                hotelRooms: null,

            }
            setUser(prev => ({
                alertModal: {message: 'Your room reservation was successfuly created. Check your profile for further details'},
                details: {
                    ...prev.details,
                    roomReservations: 
                        prev.details.roomReservations.length > 0
                        ?
                            [...prev.details.roomReservations, newReservation]
                        :
                            [newReservation]
                }
            }))
            hideCheckoutModal()
        } else {
            setPaymentReqs({ isLoading: false, errorMsg: `${errorMsg.error}. This was not supposed to happen. Contact support at support@hillstormhomes to get your refund` })
        }

        return;
    }

    if(hotel){
        const { profileimg, coverimg, hotelname, city, hotelRooms, address, hotel_id,
            country, state, rating, house_rules_do, house_rules_dont, background } = hotel

        const paymentSuccessful = () => setPaymentReqs({ isLoading: true, errorMsg: null })

        const displayRemainingHotels = allHotels.data && allHotels.data.filter(hotel => hotel.hotel_id != hotel_id).map((hotel, i) => {
            const { profileimg, coverimg, hotelname, hotelRooms, rating, state, city } = hotel
        
            const pricing = hotelRooms[0].pricing.filter(p => p.type == 'daily')[0]
            const dialyPrice = pricing.value
        
            return (
                <div className={styles.everything} key={i}>
                <div 
                    className='background-image'
                    style={{
                    backgroundImage: `url(${coverimg})`,
                    height: '40vh',
                    width: '100%'
                    }}
                />          
                <div className={styles.bottom}>
                    <div className={styles.lefty}>
                    <div className={styles.leftyone}>{hotelname} hotel</div>
                    <div className={`${styles.leftytwo} text-capitalize`}>{state}, {city}</div>
                    <div className={styles.leftythree}>Daily &#8358;{dialyPrice}</div>
                    </div>
                    <div className={styles.righty}> <img src={ratting} alt="" />{rating}</div>
                </div>
                </div>        
            )
        })            

        const displayMergedCatalogue = mergedCatalogue.slice(0, 5).map((catalogueImg, i) => {
            return(
                <div className="col-lg-1 d-flex justify-content-center" key={i}>
                    <img src={catalogueImg} alt="#" className="col-lg-11" />
                </div>
            )
        })

        const displayHouseRules = ({ houseRules }) => houseRules && houseRules.map((rule, i) => {
            return (
                <div className="col-lg-6 d-flex justify-content-center" key={i}>
                    <div className="col-lg-11">
                        <p>
                            <span className="hotel-profile-info-house-rules-text-counter">{i+1}</span>.
                            <span className="mx-2 hotel-profile-info-house-rules-text">{rule}</span>
                        </p>
                    </div>
                </div>
            )
        })        

        const displayAllMergedCatalogue = mergedCatalogue.map((catalogueImg, i) => (
            <div className="col-lg-2 mb-3">
                <img src={catalogueImg} alt="#" className="col-lg-11" />
            </div>
        ))

        const displayHotelRooms = filteredHotelRooms.map((hotelRoom, i) => {
            const { catalogue, pricing, room_id, roomReservations } = hotelRoom

            const dailyPricing = pricing.filter(p => p.type == 'daily')[0]
            const dailyPrice = dailyPricing.value

            const openBookRoom = () => {
                const bookedDates = roomReservations.map(reservation => {
                    const { startdate, expirydate } = reservation
                    return getDatesRange(new Date(startdate), new Date(expirydate))
                })

                const reservedDates = bookedDates.flat(100)

                return setBookingModal({ visible: true, roomDetails: hotelRoom, reservedDates })
            }

            return (
                <div className="col-lg-3">
                    <div    
                        className="pointer background-image col-lg-11 d-flex align-items-end justify-content-center"
                        style={{
                            backgroundImage: `url(${catalogue[0]})`,
                            borderRadius: '10px 9px 0px 0px',
                            height: '40vh',
                            backgroundSize: 'contain'
                        }}
                        key={i}
                        onClick={openBookRoom}
                    >
                        <div className="p-3 d-flex justify-content-between w-100 single-hotel-rooms-pricing-container">
                            <div>
                                <p className="m-0 p-0 single-hotel-rooms-room-id-text">{room_id}</p> 
                            </div>

                            <div>
                                <p className="m-0 p-0 single-hotel-price-text">
                                    #{dailyPrice}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

        return (
            <>
                <Nav 
                    navigateTo={navigateTo}
                    user={user}
                    setUser={setUser}
                />
                <div className="my-5 py-5">
                    <div className="px-4 mx-4 d-flex justify-content-between align-items-center mb-3">
                        <div className='d-flex align-items-center'>
                            <div>
                                <img src={profileimg} className="rounded-circle" />
                            </div>
                            <div>
                            <div className='mx-3 h-100 left-border-light-thin px-3'>
                                <div className={`d-flex align-items-center`}> 
                                    <img src={ratting} alt="" />
                                    <p className="p-0 m-0 mx-2 single-hotel-hotel-rating">{rating} Rating</p>
                                </div>
                                <p className={`p-0 m-0 mb-1 single-hotel-hotel-name text-capitalize`}>The {hotelname} Hotel</p> 
                                <p className={`p-0 m-0 single-hotel-hotel-room-count text-capitalize`}>{country} {state}</p>
                            </div>                            
                            </div>
                        </div>
                        <div>
                            <button
                                className="login-form-btn w-100 p-3"                                
                            >
                                View all rooms
                            </button>
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundImage: `url(${coverimg})`,
                            height: '80vh',
                            // width: '100%',
                            borderRadius: '11px 11px 0px 0px'
                        }}
                        className="px-4 mx-4 background-image mb-4"
                    >

                    </div>


                    <div className="px-4 mx-4 d-flex justify-content-end align-items-center mb-5">
                        <div className="d-flex col-lg-7 justify-content-end">
                            {
                                displayMergedCatalogue
                            }
                            <button 
                                className="gray-button single-hotel-additional-rooms-container d-flex align-items-center col-lg-2 justify-content-center"
                                onClick={() => setMergedModal(true)}
                            >
                                <p className="m-0 p-0 single-hotel-additional-text">
                                    {
                                        mergedCatalogue.length - 5 > 0
                                        ?
                                            `+ ${mergedCatalogue.length - 5} Photos`
                                        :
                                            'Photos'
                                    }
                                </p>
                            </button>
                        </div>
                    </div>


                    <div className="px-4 mx-2 d-flex justify-content between mb-5">
                        <div className="col-lg-7 d-flex flex-column justify-content-start">
                            <div className="col-lg-11">
                                <div className="mb-5">
                                    <h4 className="single-hotel-rooms-title m-0 p-0">Hotel Information</h4>
                                </div>
                                <div>
                                    {
                                        background 
                                        ?
                                            <p className="m-0 p-0 single-hotel-background-text">
                                                {background}
                                            </p>
                                        :
                                            <div>
                                                <ZeroItems zeroText='Hotel has not set background information' />
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div>
                                <div className="d-flex align-items-center justify-content-between single-hotel-background-hotel-info-container p-3 mb-4">
                                    <div className="d-flex align-items-center">
                                        <img alt="#" src={profileimg} className="rounded-circle" />
                                        <div className="mx-2">
                                            <h4 className="p-0 m-0 mb-2 single-hotel-background-name-text">{hotelname}</h4>
                                            <p className={`p-0 m-0 single-hotel-hotel-room-count`}>City of <span className="text-capitalize">{city}</span></p>
                                        </div>
                                    </div>  
                                    <div className="d-flex align-items-center">
                                        <img src={ratting} alt="" />
                                        <div className="mx-2">
                                            <p className="p-0 m-0 single-hotel-hotel-rating">{rating} Rating</p>
                                        </div>
                                    </div>                              
                                </div>
                                <div className="single-hotel-background-hotel-info-container p-3">
                                    <h4 className="p-0 m-0 mb-2 single-hotel-background-name-text">Specifics</h4>                                        
                                    <ul>
                                        <li className="m-0 p-0 single-hotel-background-text">{hotelRooms.length} rooms total</li>
                                        <li className="m-0 p-0 single-hotel-background-text">Located at: <span className="text-capitalize">{address}</span></li>
                                    </ul>
                                </div>                                
                            </div>
                        </div>
                    </div>
                    

                    <div 
                        className="my-2 col-lg-12 mb-5"
                        style={{paddingLeft: '2%'}}
                    >
                        <hr />
                    </div>

                    <div id="single-hotel-rooms" className="px-4 mx-2 mb-5">
                        <div className="d-flex align-items-center justify-content-between mb-5">
                            <div className="col-lg-6">
                                <h4 className="single-hotel-rooms-title">Rooms Available</h4>
                            </div>
                            <div className="d-flex align-items-center col-lg-6 justify-content-end">
                                <p className="single-hotel-filter-rooms-label-text m-0 p-0 text-end w-25">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                                        <path d="M3.81787 2.45459L3.81787 22.5003" stroke="black" stroke-width="1.90912" stroke-linecap="round"/>
                                        <path d="M14.2732 22.5005L14.2732 1.50021" stroke="black" stroke-width="1.90912" stroke-linecap="round"/>
                                        <circle cx="3.81823" cy="16.7733" r="3.81823" fill="black"/>
                                        <circle cx="3.34095" cy="3.34095" r="3.34095" transform="matrix(1 0 0 -1 10.4546 11.0454)" fill="black"/>
                                    </svg>
                                    <span className="mx-2">filter</span>
                                </p>
                                <input 
                                    type="text"
                                    onChange={onChangeFilter}
                                    className="w-75 single-hotel-filter-rooms-input py-2 px-2"
                                />
                            </div>
                        </div>

                        <div className="d-flex flex-wrap">
                            {
                                filteredHotelRooms.length
                                ? 
                                    displayHotelRooms
                                :
                                    <div className="w-100 py-5">
                                        <ZeroItems zeroText={'Zero rooms found'} />
                                    </div>
                            }
                        </div>
                    </div>

                    <div className="px-4 mx-2 mb-5">
                        <div className="mb-5">
                            <h4 className="single-hotel-rooms-title">House Rules</h4>
                        </div>
                        <div className="hotel-profile-info-house-rules-container p-3 mb-5">
                            <div className="mb-4">
                                <h6 className="hotel-profile-info-house-rules-header-text p-0 m-0 mb-2">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
                                            <path d="M15.7913 25.151L9.25 18.6082L11.4299 16.4283L15.7913 20.7881L24.511 12.0669L26.6924 14.2484L15.7913 25.1479V25.151Z" fill="#3CD623"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.54175 18.4998C1.54175 9.13421 9.13446 1.5415 18.5001 1.5415C27.8657 1.5415 35.4584 9.13421 35.4584 18.4998C35.4584 27.8655 27.8657 35.4582 18.5001 35.4582C9.13446 35.4582 1.54175 27.8655 1.54175 18.4998ZM18.5001 32.3748C16.678 32.3748 14.8737 32.016 13.1903 31.3187C11.507 30.6214 9.97739 29.5994 8.68897 28.3109C7.40056 27.0225 6.37854 25.493 5.68125 23.8096C4.98397 22.1262 4.62508 20.3219 4.62508 18.4998C4.62508 16.6777 4.98397 14.8735 5.68125 13.1901C6.37854 11.5067 7.40056 9.97714 8.68897 8.68873C9.97739 7.40032 11.507 6.37829 13.1903 5.68101C14.8737 4.98372 16.678 4.62484 18.5001 4.62484C22.18 4.62484 25.7091 6.08666 28.3112 8.68873C30.9133 11.2908 32.3751 14.82 32.3751 18.4998C32.3751 22.1797 30.9133 25.7089 28.3112 28.3109C25.7091 30.913 22.18 32.3748 18.5001 32.3748Z" fill="#3CD623"/>
                                        </svg>                                            
                                    </span>
                                    <span className="mx-2">
                                        Do's
                                    </span>
                                </h6>
                            </div>
                            <div className="">
                                {
                                    house_rules_do
                                    ?
                                        house_rules_do.length > 0
                                        ?
                                            <div className="d-flex flex-wrap justify-content-between">
                                                {displayHouseRules({ houseRules: house_rules_do })}
                                            </div>
                                        :
                                            <div className="w-100 h-100">
                                                <ZeroItems zeroText="Zero house rules found" />
                                            </div>
                                    :
                                        <div className="w-100 h-100">
                                            <ZeroItems zeroText="Zero house rules found" />
                                        </div>
                                }
                            </div>                            
                        </div>

                        <div className="hotel-profile-info-house-rules-container p-3 mb-5">
                            <div className="mb-4">
                                <h6 className="hotel-profile-info-house-rules-header-text p-0 m-0 mb-2">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
                                            <path d="M18.75 1.42188C9.04175 1.42188 1.17188 9.29175 1.17188 19C1.17188 28.7083 9.04175 36.5781 18.75 36.5781C28.4583 36.5781 36.3281 28.7083 36.3281 19C36.3281 9.29175 28.4583 1.42188 18.75 1.42188ZM18.75 5.81641C26.031 5.81641 31.9336 11.719 31.9336 19C31.9336 26.281 26.031 32.1836 18.75 32.1836C11.469 32.1836 5.56641 26.281 5.56641 19C5.56641 11.719 11.469 5.81641 18.75 5.81641ZM12.8448 10.2109C12.7738 10.2106 12.6979 10.2191 12.6205 10.2339V10.2315C11.2804 10.4832 9.30527 12.7762 10.176 13.6465L15.5342 19.0023L10.1761 24.3583C9.10459 25.4294 12.3203 28.6454 13.3919 27.574L18.75 22.2158L24.1081 27.5739C25.1796 28.6453 28.3955 25.4293 27.3239 24.3581L21.9658 19.0023L27.3239 13.6465C28.3954 12.5753 25.1797 9.36184 24.1081 10.433L18.75 15.7888L13.3919 10.433C13.241 10.2832 13.0579 10.2122 12.8448 10.2111L12.8448 10.2109Z" fill="#FF1616"/>
                                        </svg>                                           
                                    </span>
                                    <span className="mx-2">
                                        Dont's
                                    </span>
                                </h6>
                            </div>
                            <div className="">
                                {
                                    house_rules_dont
                                    ?
                                        house_rules_dont.length > 0
                                        ?
                                            <div className="d-flex flex-wrap justify-content-between">
                                                {displayHouseRules({ houseRules: house_rules_dont })}
                                            </div>
                                        :
                                            <div className="w-100 h-100">
                                                <ZeroItems zeroText="Zero house rules found" />
                                            </div>
                                    :
                                        <div className="w-100 h-100 pb-4">
                                            <ZeroItems zeroText="Zero house rules found" />
                                        </div>
                                }
                            </div>                            
                        </div>                        
                    </div>


                    <div 
                        className="my-5 col-lg-12 py-4"
                        style={{paddingLeft: '2%'}}
                    >
                        <hr />
                    </div>                    


                    <div className="mb-5 px-4 mx-2"> 
                        <div className="mb-5">
                            <h4 className="single-hotel-rooms-title m-0 p-0">See these instead</h4>
                        </div>  
                        <div className={styles.general}>
                            {
                                displayRemainingHotels
                            }
                        </div>                                        
                    </div>                   


                    <Modal
                        show={mergedModal}
                        onHide={hideMergedModal}
                        size="xl"
                    >
                        <Modal.Body
                            className="m-0 p-3"
                        >
                            <div className="d-flex justify-content-between">
                                <div className='d-flex align-items-center mb-3'>
                                    <div>
                                        <img src={profileimg} className="rounded-circle" />
                                    </div>
                                    <div>
                                    <div className='mx-3 h-100 left-border-light-thin px-3'>
                                        <p className={`p-0 m-0 mb-1 single-hotel-hotel-name`}>The {hotelname} Hotel</p>                                 
                                        <p className={`p-0 m-0 single-hotel-hotel-room-count`}>showing hotel catalogue</p>
                                    </div>                            
                                    </div>
                                </div>
                                <div className="mx-2">
                                    <ImCancelCircle 
                                        onClick={hideMergedModal}
                                        size={25} 
                                        color="#1F1F1F" 
                                        className="pointer" 
                                    />
                                </div>
                            </div>
                            <VerticalScroll defaultHeight="70vh">
                                <div className="d-flex flex-wrap">
                                    {
                                        displayAllMergedCatalogue
                                    }
                                </div>
                            </VerticalScroll>
                        </Modal.Body>
                    </Modal>

                    <BookRoom 
                        bookingModal={bookingModal}
                        hideBookingModal={hideBookingModal}
                        hotelDetails={hotel}
                        pricingSelected={pricingSelected}
                        setPricingSelected={setPricingSelected}
                        calendarValue={calendarValue}
                        onChangeCalendarValue={onChangeCalendarValue}
                        openCalendar={openCalendar}
                        setOpenCalendar={setOpenCalendar}
                        proceedToCheckout={proceedToCheckout}
                        user={user}
                        errorMsg={errorMsg}
                        setErrorMsg={setErrorMsg}
                        dateConfirmed={dateConfirmed}
                        setDateConfirmed={setDateConfirmed}
                        accessToken={accessToken}
                    />

                    {
                        checkoutModal.roomDetails && checkoutModal.roomDetails.price &&
                            <Modal
                                show={checkoutModal.visible}
                                onHide={hideCheckoutModal}
                                size='lg'
                                backdrop="static"                    
                            >
                                <Modal.Body className="p-0 m-0">
                                    <div className="bottom-border mb-5">
                                        <div className='p-3 d-flex justify-content-between'>
                                            <div className='d-flex align-items-center mb-3'>
                                                <div className='col-lg-3'>
                                                    <img src={profileimg} className="rounded-3 col-lg-12" />
                                                </div>
                                                <div>
                                                <div className='mx-3 h-100 left-border-light-thin px-3'>
                                                    <p className={`p-0 m-0 mb-1 single-hotel-hotel-name`}>The {hotelname} Hotel</p>                                 
                                                    <p className={`p-0 m-0 single-hotel-hotel-room-count`}>Room reservation checkout</p>
                                                </div>                            
                                                </div>
                                            </div>
                                            <div className="mx-2">
                                                {
                                                    !paymentReqs.isLoading &&
                                                        <ImCancelCircle 
                                                            onClick={() => hideCheckoutModal(true)}
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
                                                One click away from your reservation
                                            </h6>                                 
                                            {
                                                paymentReqs.isLoading
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
                                                paymentReqs.errorMsg
                                                ?
                                                    <p className="login-error-msg text-center my-2">
                                                        <CustomErrorMsg errorMsg={paymentReqs.errorMsg} />
                                                    </p>                                                                        
                                                :
                                                    <PaystackButton
                                                        className="login-form-btn w-100 p-3"
                                                        email={user.details.email}
                                                        amount={checkoutModal.roomDetails.price * 100}
                                                        metadata={{
                                                            name: user.details.username,
                                                            phone: user.details.phonenumber
                                                        }}
                                                        publicKey={PUBLIC_KEY}
                                                        text={"Pay Now"}
                                                        onSuccess={paymentSuccessful}
                                                        onClose={() => hideCheckoutModal(true)}
                                                    />                                                
                                            }
                                        </div>
                                    </div>
                                </Modal.Body>                        
                            </Modal>                        
                    }
                </div>

                    <div 
                        className="my-2 col-lg-12"
                    >
                        <hr />
                    </div>                 

                <div className="d-flex justify-content-between align-items-center px-4 mx-2 my-2">
                    <div>
                        <h6 className="single-hotel-footer-header m-0 p-0">HILLSTOURHOMES</h6>
                    </div>                    
                    <div>
                        <img src={logo} />
                    </div>
                </div>                
            </>
        )

    } else{
        return <Loading loadingText={'fetching this hotel'} />
    }
}