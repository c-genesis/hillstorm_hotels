import React, { useEffect, useState } from "react";
import Loading from "../../../loading/Loading";
import { FaScrewdriverWrench } from 'react-icons/fa6'
import CustomErrorMsg from "../../../errorMessage/CustomErrorMsg";
import { Modal, Spinner } from "react-bootstrap";
import { requestApi } from "../../../apiRequests/requestApi";
import ZeroItems from "../../../ZeroItems/ZeroItems";
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { GiCancel } from 'react-icons/gi'
import VerticalScroll from "../../../scroll/VerticalScroll";
import { NIGERIAN_STATES_AND_CITIES } from "../../../globals/globals";



export default function HotelProfile_Info({ user_HP, setUser_HP, accessToken }){

    const [profileChangeReqs, setProfileChangeReqs] = useState()
    const [hotelBackgroundInput, setHotelBackgroundInput] = useState()
    const [hotelStateInput, setHotelStateInput] = useState()
    const [hotelCityInput, setHotelCityInput] = useState()
    const [hotelAddressInput, setHotelAddressInput] = useState()
    const [changeErrorMsg, setChangeErrorMsg] = useState({ changeType: null, errorMsg: null })
    const [activeHouseRules, setActiveHouseRules] = useState({ showModal: false, rules: [], changeType: '' })
    const [newRuleInput, setNewRuleInput] = useState('')

    useEffect(() => {
        if(user_HP && user_HP.details){
            const { state, city, address } = user_HP.details
            setHotelStateInput(state)
            setHotelCityInput(city)
            setHotelAddressInput(address)
        }
    }, [user_HP])

    useEffect(() => {
        if(profileChangeReqs){
            hotelProfileEdit({ reqs: profileChangeReqs})
        }
    }, [profileChangeReqs])

    const hideHouseRulesEdit = () => {
        setNewRuleInput('')
        setActiveHouseRules({ showModal: false, rules: [], changeType: '' })
    }

    const hotelProfileEdit = async ({ reqs }) => {
        const { changeType, value, newLocation } = reqs

        if(user_HP){
            const { hotel_id } = user_HP.details
            let requestBody;


            if(newLocation){
                requestBody = {
                    'hotel_id': hotel_id,
                    ...newLocation
                }
            } else{
                requestBody = {
                    'hotel_id': hotel_id,
                    [changeType]: changeType == 'house_rules_do' || changeType == 'house_rules_dont' ? JSON.stringify(value) : value,
                }
            }


            const updatedHotelProfile = await requestApi({ url: 'users/hotels/update-hotel', method: 'put', data: requestBody, token: accessToken })
            const { responseStatus, result, errorMsg } = updatedHotelProfile

            if(responseStatus){
                // const { data } = result
                const changesMade = 
                    newLocation
                    ? 
                        {...newLocation}
                    :
                        {[changeType]: value}

                setUser_HP(prev => ({
                    ...prev,
                    alertModal: {message: 'hotel information successfully updated'},
                    newRoute: null,
                    newRoute_HP: null,
                    details: {
                        ...prev.details,
                        ...changesMade
                    }
                }))
            } else{
                setProfileChangeReqs('')
                setChangeErrorMsg({ changeType, errorMsg: errorMsg.error })
            }
            


        } else{
            setProfileChangeReqs('')
            setChangeErrorMsg({ changeType, errorMsg: `Error updating profile. The fault's on our end, we are fixing it. Try again later!` })
        }


        resetInputs()
        return setProfileChangeReqs()
    }    

    const resetInputs = () => {
        setHotelBackgroundInput('')
        setHotelAddressInput('')
        setHotelCityInput('')
        setHotelStateInput('')
        hideHouseRulesEdit()
    }


    const initiateProfileChange = ({ changeType, value }) => {
        if(value){
            if(value.length == 0 || value.length < 0){
                setProfileChangeReqs()
                return setChangeErrorMsg({ changeType, errorMsg: 'No change found here!' })                
            } else{
                setProfileChangeReqs({ 
                    changeType, 
                    value,  
                })
                return setChangeErrorMsg({ changeType: null, errorMsg: null })
            }
        } else{
            setProfileChangeReqs()
            setChangeErrorMsg({ changeType, errorMsg: 'No change found here!' })
        }

        return;
    } 
    
    const initiateHotelLocationChange = () => {
        if(!hotelStateInput){
            return setChangeErrorMsg({ changeType: 'state', errorMsg: 'Required' })
        }

        if(!hotelCityInput){
            return setChangeErrorMsg({ changeType: 'city', errorMsg: 'Required'})
        }

        if(!hotelAddressInput){
            return setChangeErrorMsg({ changeType: 'address', errorMsg: 'Required'})
        }

        setChangeErrorMsg({ changeType: null, error: null})
        return setProfileChangeReqs({
            changeType: 'location',
            value: '',
            newLocation: {
                state: hotelStateInput,
                city: hotelCityInput,
                address: hotelAddressInput                
            }
        })
    }

    if(user_HP){

        const { details } = user_HP

        const { house_rules_do, house_rules_dont, background, hotelname, state, city, address } = details



        const handleHotelBackgroundChange = e => {
            if(e){
                setChangeErrorMsg({ changeType: null, errorMsg: null })
                setHotelBackgroundInput(e.target.value)
            }
        
            return;
        }

        const handleHotelStateChange = e => {
            if(e){
                setChangeErrorMsg({ changeType: null, errorMsg: null })
                setHotelStateInput(e.target.value)
                if(e.target.value == state){
                    setHotelAddressInput(address)
                    setHotelCityInput(city)
                } else{
                    setHotelAddressInput('')
                    setHotelCityInput('')                    
                }
            }

            return
        }

        const handleHotelCityChange = e => {
            if(e){
                setChangeErrorMsg({ changeType: null, errorMsg: null })
                setHotelCityInput(e.target.value)
                if(e.target.value == city){
                    setHotelAddressInput(address)
                } else{
                    setHotelAddressInput('')                    
                }
            }

            return
        }

        const handleHotelAddressChange = e => {
            if(e){
                setChangeErrorMsg({ changeType: null, errorMsg: null })
                setHotelAddressInput(e.target.value)
            }

            return;
        }

        const handleNewRuleInput = e => {
            if(e){
                setChangeErrorMsg({ changeType: null, errorMsg: null })
                setNewRuleInput(e.target.value)
            }

            return;
        }

        const addHouseRulesDo = () => addHouseRules({ changeType: 'house_rules_do' })
        const addHouseRulesDont = () => addHouseRules({ changeType: 'house_rules_dont' })
        
        const addHouseRules = ({ changeType }) => {
            if(changeType == 'house_rules_do'){
                setActiveHouseRules({ showModal: true, rules: house_rules_do, changeType })
            } else{
                setActiveHouseRules({ showModal: true, rules: house_rules_dont, changeType })
            }

            return setChangeErrorMsg({ changeType: null, errorMsg: null })
        }    
        
        
        const initiateRuleUpdate = () => {
            if(activeHouseRules.rules.length > 0){
                if(activeHouseRules.rules.length > 12){
                    return setChangeErrorMsg({ changeType, errorMsg: 'Only 12 house rules allowed for a single hotel' })
                }

                const { rules, showModal, changeType } = activeHouseRules
                return initiateProfileChange({ changeType, value: rules })
            }

            return setChangeErrorMsg({ changeType: 'house_rule_do', errorMsg: 'House rules are mandatory for hotels' })
        }
        
        const addNewRule = () => {
            if(!newRuleInput){
                return setChangeErrorMsg({ changeType: 'house_rule_do', errorMsg: 'Rules are not meant to be empty' })
            }

            if(newRuleInput.length < 350){
                setNewRuleInput('')
                return setActiveHouseRules(prev => ({
                    ...prev, rules: [
                        ...prev.rules, newRuleInput
                    ]
                }))
            }

            return setChangeErrorMsg({ changeType: 'house_rule_do', errorMsg: 'Too long, reduce to less than 350 characters' })
        }

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

        const displayActiveHouseRules = activeHouseRules.rules && activeHouseRules.rules.map((activeRule, i) => {

            const removeFromList = () => {
                const filteredActiveRules = activeHouseRules.rules.filter((rule, rule_index) => i != rule_index)
                setActiveHouseRules(prev => ({...prev, rules: filteredActiveRules}))
            }

            return (
                <div className="col-lg-6 d-flex justify-content-center" key={i}>
                    <div className="col-lg-11">
                        <p>
                            <span className="hotel-profile-info-house-rules-text-counter">{i+1}</span>.
                            <span className="mx-2 hotel-profile-info-house-rules-text">{activeRule}</span>
                            <span>
                                <GiCancel size={20} className="pointer" onClick={removeFromList} />
                            </span>
                        </p>
                    </div>
                </div>
            )
        })

        const displayCities = ({ state }) => 
            state && NIGERIAN_STATES_AND_CITIES.filter(nigerianState => nigerianState.state.toLowerCase() == state.toLowerCase())
                [0].cities.map((city, i) => (
                    <option key={i} value={city}>{city}</option>
                ))

        const displayStates = NIGERIAN_STATES_AND_CITIES.map((nigerianState, i) => {
            const { state } = nigerianState
            return (
                <option key={i} value={state}>{state}</option>
            )
        })        

        return (
            <div className="mx-3 d-flex justify-content-center">
                <div className="col-lg-12">
                    <div className="py-3">
                        <div className="mb-5">
                            <div className="mb-3">
                                <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Hotel Information</h6>                                    
                            </div> 
                            <div className="mb-4">
                                <label htmlFor="background" className="login-form-label mb-2">Hotel Background</label>
                                <br/>
                                <textarea 
                                    name="background"
                                    value={hotelBackgroundInput}
                                    onChange={handleHotelBackgroundChange}
                                    placeholder={background ? background : `Hotel background information. A text describing the history of ${hotelname} hotel. Not more than 4500 characters`}
                                    className="login-form-input-field p-2 w-75"
                                    type="text"
                                    style={{
                                        height: '35vh'
                                    }}
                                />
                                <button 
                                    onClick={() => initiateProfileChange({ changeType: 'background', value: hotelBackgroundInput })}
                                    disabled={profileChangeReqs ? true : false}
                                    style={{
                                        background: '#1F1F1F', 
                                        opacity: profileChangeReqs ? 0.76 : 1
                                    }}
                                    className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                >
                                    {
                                        profileChangeReqs 
                                        ?
                                            profileChangeReqs.changeType == 'background'
                                            ?
                                                <span><Spinner size="sm" className="mx-2" /></span>
                                            :
                                                <FaScrewdriverWrench size={15} />                                            
                                        :
                                            <FaScrewdriverWrench size={15} />
                                    }
                                </button>  
                                {
                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'background'
                                    ?
                                        <p className="login-error-msg text-center my-2">
                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                        </p>
                                    :
                                        <></>                                    
                                }
                            </div>
                        </div>
                        <div className="mb-5">
                            <div className="mb-3">
                                <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1 mb-2">Hotel Location</h6>                                    
                            </div>  
                                {
                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'location'
                                    ?
                                        <p className="login-error-msg text-center my-2">
                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} />
                                        </p>
                                    :
                                        <></>                                    
                                }                                                      
                            <div className="mb-4">
                                <label htmlFor="state" className="login-form-label mb-2">State</label>
                                <br/>
                                <select 
                                    name="state"
                                    value={hotelStateInput}
                                    onChange={handleHotelStateChange}
                                    className="login-form-input-field p-2 w-75"
                                >
                                    <option value=''>Select state</option>
                                    {
                                        displayStates
                                    }
                                </select>          
                                {
                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'state'
                                    ?
                                        <p className="login-error-msg text-center my-2">
                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                        </p>
                                    :
                                        <></>                                    
                                }                                                                                    
                            </div> 
                            <div className="mb-4">
                                <label htmlFor="city" className="login-form-label mb-2">City</label>
                                <br/>
                                <select 
                                    name="city"
                                    value={hotelCityInput}
                                    onChange={handleHotelCityChange}
                                    className="login-form-input-field p-2 w-75"
                                >
                                    <option value=''>Select city</option>
                                    {
                                        displayCities({ state: hotelStateInput })
                                    }
                                </select>         
                                {
                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'city'
                                    ?
                                        <p className="login-error-msg text-center my-2">
                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                        </p>
                                    :
                                        <></>                                 
                                }                                                                                    
                            </div>
                            <div className="mb-4">
                                <label htmlFor="address" className="login-form-label mb-2">Address</label>
                                <br/>
                                <textarea 
                                    name="address"
                                    value={hotelAddressInput}
                                    onChange={handleHotelAddressChange}
                                    placeholder={hotelAddressInput ? hotelAddressInput : `Address for ${hotelname} hotel.`}
                                    className="login-form-input-field p-2 w-75"
                                    type="text"
                                    style={{
                                        height: '20vh'
                                    }}
                                />          
                                {
                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'address'
                                    ?
                                        <p className="login-error-msg text-center my-2">
                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                        </p>
                                    :
                                        <></>                                    
                                }                                                                                    
                            </div>
                            <button 
                                onClick={initiateHotelLocationChange}
                                disabled={profileChangeReqs ? true : false}
                                style={{
                                    background: '#1F1F1F', 
                                    opacity: profileChangeReqs ? 0.76 : 1
                                }}
                                className="mb-4 hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                            >
                                {
                                    profileChangeReqs 
                                    ?
                                        profileChangeReqs.changeType == 'location'
                                        ?
                                            <>
                                                <span><Spinner size="sm" /></span>
                                                <span className="mx-2">Updating</span>                                            
                                            </>
                                        :
                                            <>
                                                <FaScrewdriverWrench size={15} />
                                                <span className="mx-2">Update address</span>                                            
                                            </>
                                    :
                                        <>
                                            <FaScrewdriverWrench size={15} />
                                            <span className="mx-2">Update address</span>                                            
                                        </>
                                }
                            </button>                                                                                     
                        </div>
                        <div className="mb-5">
                            <div className="mb-4">
                                <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">House Rules</h6>                                    
                            </div> 
                            <div className="mb-4">
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
                                                <></>
                                        }
                                    </div>
                                    <div className="w-100 d-flex justify-content-end"> 
                                        <button 
                                            onClick={addHouseRulesDo}
                                            disabled={profileChangeReqs ? true : false}
                                            style={{
                                                background: '#1F1F1F', 
                                                opacity: profileChangeReqs ? 0.76 : 1
                                            }}
                                            className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                        >
                                            <FaScrewdriverWrench size={15} />
                                        </button>                                                                              
                                    </div>
                                </div>
                                <div className="my-5" />
                                <div className="hotel-profile-info-house-rules-container p-3">
                                    <div className="mb-4">
                                        <h6 className="hotel-profile-info-house-rules-header-text p-0 m-0 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
                                                <path d="M18.75 1.42188C9.04175 1.42188 1.17188 9.29175 1.17188 19C1.17188 28.7083 9.04175 36.5781 18.75 36.5781C28.4583 36.5781 36.3281 28.7083 36.3281 19C36.3281 9.29175 28.4583 1.42188 18.75 1.42188ZM18.75 5.81641C26.031 5.81641 31.9336 11.719 31.9336 19C31.9336 26.281 26.031 32.1836 18.75 32.1836C11.469 32.1836 5.56641 26.281 5.56641 19C5.56641 11.719 11.469 5.81641 18.75 5.81641ZM12.8448 10.2109C12.7738 10.2106 12.6979 10.2191 12.6205 10.2339V10.2315C11.2804 10.4832 9.30527 12.7762 10.176 13.6465L15.5342 19.0023L10.1761 24.3583C9.10459 25.4294 12.3203 28.6454 13.3919 27.574L18.75 22.2158L24.1081 27.5739C25.1796 28.6453 28.3955 25.4293 27.3239 24.3581L21.9658 19.0023L27.3239 13.6465C28.3954 12.5753 25.1797 9.36184 24.1081 10.433L18.75 15.7888L13.3919 10.433C13.241 10.2832 13.0579 10.2122 12.8448 10.2111L12.8448 10.2109Z" fill="#FF1616"/>
                                            </svg>
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
                                                <></>
                                        }
                                    </div>
                                    <div className="w-100 d-flex justify-content-end"> 
                                        <button 
                                            onClick={addHouseRulesDont}
                                            disabled={profileChangeReqs ? true : false}
                                            style={{
                                                background: '#1F1F1F', 
                                                opacity: profileChangeReqs ? 0.76 : 1
                                            }}
                                            className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                        >
                                            <FaScrewdriverWrench size={15} />
                                        </button>                                                                              
                                    </div>
                                </div>                                
                            </div> 
                        </div>                       
                    </div>
                </div>


                <Modal
                    onHide={hideHouseRulesEdit}
                    show={activeHouseRules.showModal}
                    size="lg"
                >
                    <Modal.Body className="m-0 p-0 my-3">
                        <div>
                            <div className="mb-4 w-100">
                                <h4 className="pb-2 px-4 hotel-profile-main-admin-profile-header bottom-border hotel-profile-room-creation-active-nav d-flex justify-content-between">
                                    <span>Editting House Rules</span>
                                    <span>
                                        <GiCancel size={25} onClick={hideHouseRulesEdit} color="#1F1F1F" className="pointer" />
                                    </span>
                                </h4>
                            </div>
                            <div className="mx-3">
                                {
                                    activeHouseRules.rules &&
                                        <div className="">
                                            <div className="mb-4">
                                                {
                                                    activeHouseRules.changeType == 'house_rules_do'
                                                    ?
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
                                                    :
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
                                                }
                                            </div>
                                            <div className="mb-5">
                                                {
                                                    activeHouseRules.rules.length > 0
                                                    ?
                                                        <VerticalScroll defaultHeight="25vh">
                                                            <div className="d-flex justify-content-center">
                                                                <div className="d-flex flex-wrap justify-content-between col-lg-10">
                                                                    {displayActiveHouseRules}
                                                                </div>
                                                            </div>
                                                        </VerticalScroll>                                                            
                                                    :
                                                        <div>
                                                            <ZeroItems zeroText="Zero rules" />
                                                        </div>
                                                }
                                            </div> 
                                            <div>
                                                <div className="mb-4">
                                                    <label htmlFor="rules-input" className="login-form-label mb-2">
                                                        Add new 
                                                    </label>
                                                    <br/>                                                
                                                    <textarea
                                                        name="rules-input"
                                                        style={{height: '10vh', width: '90%'}}
                                                        placeholder="New house rules that customers obey by doing. Must be less than 350 characters"
                                                        className="login-form-input-field p-2 w-75"
                                                        onChange={handleNewRuleInput}
                                                        value={newRuleInput}
                                                    />
                                                    {
                                                        changeErrorMsg.errorMsg && (changeErrorMsg.changeType == 'house_rule_do' || changeErrorMsg.changeType == 'house_rule_dont')
                                                        ?
                                                            <p className="login-error-msg text-center my-2">
                                                                <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                                            </p>
                                                        :
                                                            <></>                                    
                                                    }
                                                </div>
                                                <div className="d-flex">
                                                    <button
                                                        className="login-form-btn p-3"
                                                        onClick={addNewRule}
                                                        style={{
                                                            opacity: profileChangeReqs ? 0.76 : 1
                                                        }}
                                                        disabled={profileChangeReqs ? true : false}                                                        
                                                    >
                                                        Insert Rule
                                                    </button>
                                                    <button
                                                        className="login-form-btn p-3 mx-2 black-button"
                                                        style={{
                                                            backgroundColor: '#1F1F1F',
                                                            opacity: profileChangeReqs ? 0.76 : 1
                                                        }}
                                                        disabled={profileChangeReqs ? true : false}
                                                        onClick={initiateRuleUpdate}
                                                    >
                                                        {
                                                            profileChangeReqs && <span><Spinner size="sm" className="mx-2" /></span>
                                                        }
                                                        <span>
                                                            <FaScrewdriverWrench size={15} />
                                                            <span className="mx-2">Save Changes</span>
                                                        </span>
                                                    </button>                                                    
                                                </div>
                                            </div>                                           
                                        </div>
                                }
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    } else{
        return <Loading loadingText='Resolving' />
    }
}