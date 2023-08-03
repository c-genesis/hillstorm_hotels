import React, { useEffect, useState } from "react";
import CustomErrorMsg from "../../../../errorMessage/CustomErrorMsg";
import { FaScrewdriverWrench } from 'react-icons/fa6'
import { Spinner } from "react-bootstrap";
import { ONLY_NUMBERS_REG_EXP, PHONE_REG_EXP } from "../../../../globals/globals";
import { useHref, useLocation } from "react-router-dom";
import { FaPercentage } from 'react-icons/fa'
import { requestApi } from "../../../../apiRequests/requestApi";
import ALert1 from "../../../../alerts/Alert1";


export default function RoomCreation({ 
    user_HP, accessToken, goToCatalogue, setActiveRoom, setUser_HP, activeRoom
}){
    
    const [specificRoom, setSpecificRoom] = useState(activeRoom)
    const isEdit = specificRoom.room_id ? true : false
    const parsedPricing = isEdit ? specificRoom.pricing : null

    const [roomIdInput, setRoomIdInput] = useState()
    const [roomPricingInput, setRoomPricingInput] = useState(
        isEdit
        ?
            parsedPricing
        :
            [
                { type: 'daily', value: '' },
                { type: 'weekly', value: '' },
                { type: 'monthly', value: '' },
            ]
    )

    const [roomChangeReqs, setRoomChangeReqs] = useState()
    const [changeErrorMsg, setChangeErrorMsg] = useState({ changeType: null, errorMsg: null })
    const [percentageDiscountInput, setPercentageDiscountInput] = useState(
        isEdit
        ?
            specificRoom.percentagediscount
        :
            null
    )

    const [dailyPercentageValue, setDailyPercentageValue] = useState()
    const [weeklyPercentageValue, setWeeklyPercentageValue] = useState()
    const [monthlyPercentageValue, setMonthlyPercentageValue] = useState()

    useEffect(() => {
        if(isEdit){
            calculatePercentages()
        }
    }, [])

    useEffect(() => {
        if(roomChangeReqs){
            hotelRoomEdit({reqs: roomChangeReqs})
        }
    }, [roomChangeReqs])

    const editActiveRoom = ({ edittedRoom }) => {
        const { room_id } = edittedRoom
        const edittedHotelRooms = user_HP.details.hotelRooms.map(room => {
            if(room.room_id == room_id){
                return edittedRoom
            }
            return room
        })

        setUser_HP(prev => ({
            ...prev,
            alertModal: {message: 'hotel room successfully updated'},
            newRoute: null,
            newRoute_HP: null,
            details: {
                ...prev.details,
                hotelRooms: edittedHotelRooms
            }
        }))

        setActiveRoom(edittedRoom)

        setSpecificRoom(edittedRoom)
    }    


    const hotelRoomEdit = async ({ reqs }) => {
        const { changeType, value, url, inputId } = reqs
        
        const requestBody = {
            room_id: specificRoom.room_id,
            [changeType]: value
        }

        const edittedHotelRoom = await requestApi({ url, method: 'put', data: requestBody, token: accessToken })
        const { responseStatus, result, errorMsg } = edittedHotelRoom
        if(responseStatus){
            const { data } = result
            setRoomChangeReqs()
            calculatePercentages()
            clearInputFields({ inputId })
            editActiveRoom({ edittedRoom: data })
        } else{
            setRoomChangeReqs()
            clearInputFields({ inputId })
            return setChangeErrorMsg({ changeType, errorMsg: errorMsg.error })
        }
    }

    const clearInputFields = ({ inputId }) => {
        const specificInputField = document.getElementById(inputId)
        if(specificInputField){
            specificInputField.value = ''
        }
        return;
    }

    const resetPercentageValues = () => {
        setDailyPercentageValue()
        setWeeklyPercentageValue()
        setMonthlyPercentageValue()        
    }

    const calculatePercentages = () => {
        setChangeErrorMsg({ errorMsg: null, changeType: null })

        if(!percentageDiscountInput){
            return setChangeErrorMsg({ errorMsg: 'Required', changeType: 'percentagediscount' })
        }

        if(!checkRoomPricing({ value: percentageDiscountInput, type: 'percentagediscount' })) { return; }

        if(percentageDiscountInput > 100){
            return setChangeErrorMsg({ errorMsg: 'Cannot be above 100', changeType: 'percentagediscount' })
        }
        let dailyP;
        let weeklyP;
        let monthlyP;

        for(let i = 0; i < roomPricingInput.length; i++){
            if(!roomPricingInput[i].value){
                return setChangeErrorMsg({ errorMsg: 'Required', changeType: roomPricingInput[i].type })
            } else{
                const percentage = percentageDiscountInput / 100
                const discountValue = (percentage * roomPricingInput[i].value).toFixed(2)
                const actualValue = (roomPricingInput[i].value - discountValue).toFixed(2)

                if(roomPricingInput[i].type == 'daily'){
                    dailyP = {
                        actualValue,
                        discountValue
                    }
                }
                
                if(roomPricingInput[i].type == 'weekly'){
                    weeklyP = {
                        actualValue,
                        discountValue
                    }
                }

                if(roomPricingInput[i].type == 'monthly'){
                    monthlyP = {
                        actualValue,
                        discountValue
                    }
                }
            }
        }

        setDailyPercentageValue(dailyP)
        setWeeklyPercentageValue(weeklyP)
        setMonthlyPercentageValue(monthlyP)
        
        return;
    }

    const proceed = () => {
        if(!roomIdInput){
            return setChangeErrorMsg({ errorMsg: 'Required', changeType: 'room_id' })
        }

        if(!percentageDiscountInput){
            return setChangeErrorMsg({ errorMsg: 'Required', changeType: 'percentagediscount' })
        }

        if(!checkRoomPricing({ value: percentageDiscountInput, type: 'percentagediscount' })) { return; } 
        
        if(percentageDiscountInput > 100){
            return setChangeErrorMsg({ errorMsg: 'Cannot be above 100', changeType: 'percentagediscount' })
        }        

        if(roomPricingInput){
            for(let i = 0; i < roomPricingInput.length; i++){
                if(!checkRoomPricing({ value: roomPricingInput[i].value, type: roomPricingInput[i].type })) { return; }                 
                if(!roomPricingInput[i].value){
                    return setChangeErrorMsg({ errorMsg: 'Required', changeType: roomPricingInput[i].type})
                }
            }                      
        }

        setChangeErrorMsg({ errorMsg: null, changeType: null })

        return goToCatalogue && goToCatalogue({
            newRoom: {
                room_id: `${user_HP.details.hotelname}_${roomIdInput}`,
                pricing: JSON.stringify(roomPricingInput),
                percentagediscount: percentageDiscountInput
            }
        })
    }

    const checkRoomPricing = ({ value, type }) => {
        if(!(String(value).match(ONLY_NUMBERS_REG_EXP))){        
            setChangeErrorMsg({ errorMsg: 'Invalid format or less than 0', changeType: type })
            return false
        }

        if(value < 0){
            setChangeErrorMsg({ errorMsg: 'Cannot be below 0', changeType: type })
            return false
        }
        
        return true
    }


    const handleRoomPricingChange = ({ type, value }) => {
        setChangeErrorMsg({ changeType: null, errorMsg: null })

        const newRoomPricing = roomPricingInput.map(pricingMethod => {
            if(pricingMethod.type == type){
                pricingMethod.value = 
                    isEdit
                    ?
                        value != ''
                        ?
                            value
                        :
                            parsedPricing.filter(pricing => pricing.type == type)[0].value
                    :
                        value
            }
            return pricingMethod
        })
        setRoomPricingInput(newRoomPricing)

        return resetPercentageValues()
    }

    const handleRoomIdChange = (e) => {
        setRoomIdInput(e.target.value)
        return setChangeErrorMsg({ changeType: null, errorMsg: null })
    }
    
    const handlePercentageDiscountChange = (e) => {
        setPercentageDiscountInput(
            isEdit
            ?                
                e.target.value 
                ? 
                    e.target.value 
                : 
                    specificRoom.percentagediscount
            :
                e.target.value
        )
        setChangeErrorMsg({ changeType: null, errorMsg: null })
        return resetPercentageValues()
    }

    const initiateProfileChange = ({ changeType, value, inputId }) => {
        if(value){
            setRoomChangeReqs({ 
                changeType, 
                value,
                inputId,
                url: 'users/hotels/edit-room'
            })
            return setChangeErrorMsg({ changeType: null, errorMsg: null })
        }

        return setChangeErrorMsg({ changeType, errorMsg: 'No change found here!' })
    }   
    
    const initiatePercentageDiscountChange = () => {
        if(!checkRoomPricing({ value: percentageDiscountInput, type: 'percentagediscount'})){
            return;
        }
        
        if((percentageDiscountInput == specificRoom.percentagediscount) || !percentageDiscountInput){
            return setChangeErrorMsg({ changeType: 'percentagediscount', errorMsg: 'No change found here!' })
        }

        return initiateProfileChange({ inputId: 'percentagediscount', changeType: 'percentagediscount', value: percentageDiscountInput })
    }

    const initiateRoomPricingChange = ({ inputId }) => {
        for(let i = 0; i < roomPricingInput.length; i++){
            const { type, value } = roomPricingInput[i]
            if(!(checkRoomPricing({ value, type }))){
                return;
            }
        }

        return initiateProfileChange({ inputId, changeType: 'pricing', value: JSON.stringify(roomPricingInput) })
    }

    return (
        <div>
            <div className="">
                <div className="mx-3 d-flex justify-content-center">
                    <div className="col-lg-12">
                        <div className="py-3">
                            <div>
                                <div className="mb-4">
                                    <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Room Details</h6>                                    
                                </div> 
                                <div className="mb-5">
                                    {
                                        !isEdit ?
                                            <>
                                                <label htmlFor="room_id" className="login-form-label mb-2">Room Id</label>
                                                <br/>
                                                <input 
                                                    name="room_id"
                                                    // value={roomIdInput}
                                                    onChange={handleRoomIdChange}
                                                    placeholder={specificRoom ? specificRoom.room_id ? specificRoom.room_id : 'Unique Room Id' : 'Unique Room Id'}
                                                    className="login-form-input-field p-2 w-75"
                                                    type="text"
                                                /> 
                                            </>  
                                        :
                                        <div>
                                            <h6 htmlFor="room_id" className="login-form-label p-0 m-0 mb-2">Room Id</h6>
                                            <p className="m-0 p-0 custom-placeholder">{specificRoom.room_id}</p>
                                        </div>
                                    }
                                    {
                                        changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'room_id'
                                        ?
                                            <p className="login-error-msg text-center my-2">
                                                <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                            </p>
                                        :
                                            <></>                                    
                                    }
                                </div> 
                                <div className="mb-4">
                                    <div className="mb-4">
                                        <h6 className="hotel-profile-main-admin-profile-sub-text left-border px-3 py-1">Pricing</h6>                                    
                                    </div>                                                                                                       
                                    <div className="">
                                        <div className="mb-4">
                                            <label htmlFor="percentagediscount" className="login-form-label mb-2">Percentage Discount</label>
                                            <br/>
                                            <input 
                                                id="percentagediscount"
                                                name="percentagediscount"
                                                onChange={handlePercentageDiscountChange}
                                                placeholder={specificRoom ? specificRoom.percentagediscount ? specificRoom.percentagediscount : 'Percentage Discount' : 'Percentage Discount'}
                                                className="login-form-input-field p-2 w-75"
                                                type="number"
                                            />
                                            {
                                                isEdit
                                                ?
                                                    <button 
                                                        onClick={initiatePercentageDiscountChange}
                                                        disabled={roomChangeReqs ? true : false}
                                                        style={{background: '#1F1F1F', opacity: roomChangeReqs ? 0.76 : 1}}
                                                        className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                                    >
                                                        {
                                                            roomChangeReqs 
                                                            ?
                                                                roomChangeReqs.changeType == 'percentagediscount'
                                                                ?
                                                                    <span><Spinner size="sm" className="mx-2" /></span>
                                                                :
                                                                    <FaScrewdriverWrench size={15} />                                            
                                                            :
                                                                <FaScrewdriverWrench size={15} />
                                                        }
                                                    </button> 
                                                :
                                                    <></>                                        
                                            }
                                            {
                                                changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'percentagediscount'
                                                ?
                                                    <p className="login-error-msg text-center my-2">
                                                        <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                                    </p>
                                                :
                                                    <></>                                    
                                            }
                                        </div>  
                                        {
                                            changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'pricing'
                                            ?
                                                <p className="login-error-msg text-center my-2">
                                                    <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                                </p>
                                            :
                                                <></>                                    
                                        }                                   
                                        <div className="d-flex justify-content-between">
                                            <div className={`${isEdit ? '' : 'col-lg-4'}`}>
                                                <label htmlFor="dailyPricing" className="login-form-label mb-2">Daily</label>
                                                <br/>
                                                <input 
                                                    id="daily"
                                                    name="dailyPricing"
                                                    onChange={(e) => handleRoomPricingChange({ type: 'daily', value: e.target.value})}
                                                    placeholder={"Daily Price"}
                                                    className="login-form-input-field p-2 w-75"
                                                    type="number"
                                                    // value={hotelEmailInput}
                                                />
                                                {
                                                    isEdit
                                                    ?
                                                        <button 
                                                            onClick={() => initiateRoomPricingChange({ inputId: 'daily' })}
                                                            disabled={roomChangeReqs ? true : false}
                                                            style={{background: '#1F1F1F', opacity: roomChangeReqs ? 0.76 : 1}}
                                                            className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                                        >
                                                        {
                                                            roomChangeReqs 
                                                            ?
                                                                roomChangeReqs.changeType == 'daily'
                                                                ?
                                                                    <span><Spinner size="sm" className="mx-2" /></span>
                                                                :
                                                                    <FaScrewdriverWrench size={15} />                                            
                                                            :
                                                                <FaScrewdriverWrench size={15} />
                                                        }
                                                        </button>
                                                    :
                                                        <></>
                                                }                                                
                                                { 
                                                    dailyPercentageValue && 
                                                        <div>
                                                            <p className="login-form-label my-2">
                                                                Discount value: {dailyPercentageValue.discountValue}
                                                            </p>
                                                            <p className="login-form-label my-2">
                                                                Actual value: {dailyPercentageValue.actualValue}
                                                            </p>                                                            
                                                        </div>
                                                }
                                                {
                                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'daily'
                                                    ?
                                                        <p className="login-error-msg text-center my-2">
                                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                                        </p>
                                                    :
                                                        <></>                                    
                                                }                                                                                                                                              
                                            </div>
                                            <div className={`${isEdit ? '' : 'col-lg-4'}`}>
                                                <label htmlFor="weeklyPricing" className="login-form-label mb-2">Weekly</label>
                                                <br/>
                                                <input 
                                                    id="weekly"
                                                    name="weeklyPricing"
                                                    onChange={(e) => handleRoomPricingChange({ type: 'weekly', value: e.target.value})}
                                                    placeholder={"Weekly Price"}
                                                    className="login-form-input-field p-2 w-75"
                                                    type="number"
                                                    // value={hotelEmailInput}
                                                />
                                                {
                                                    isEdit
                                                    ?
                                                        <button 
                                                            onClick={() => initiateRoomPricingChange({ inputId: 'weekly' })}
                                                            disabled={roomChangeReqs ? true : false}
                                                            style={{background: '#1F1F1F', opacity: roomChangeReqs ? 0.76 : 1}}
                                                            className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                                        >
                                                        {
                                                            roomChangeReqs 
                                                            ?
                                                                roomChangeReqs.changeType == 'weekly'
                                                                ?
                                                                    <span><Spinner size="sm" className="mx-2" /></span>
                                                                :
                                                                    <FaScrewdriverWrench size={15} />                                            
                                                            :
                                                                <FaScrewdriverWrench size={15} />
                                                        }
                                                        </button>                                                    
                                                    :
                                                        <></>
                                                }                                                 
                                                { 
                                                    weeklyPercentageValue && 
                                                        <div>
                                                            <p className="login-form-label my-2">
                                                                Discount value: {weeklyPercentageValue.discountValue}
                                                            </p>
                                                            <p className="login-form-label my-2">
                                                                Actual value: {weeklyPercentageValue.actualValue}
                                                            </p>                                                            
                                                        </div>
                                                }
                                                {
                                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'weekly'
                                                    ?
                                                        <p className="login-error-msg text-center my-2">
                                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                                        </p>
                                                    :
                                                        <></>                                    
                                                }                                                                                                                                              
                                            </div>
                                            <div className={`${isEdit ? '' : 'col-lg-4'}`}>
                                                <label htmlFor="monthlyPricing" className="login-form-label mb-2">Monthly</label>
                                                <br/>
                                                <input 
                                                    id="monthly"
                                                    name="monthlyPricing"
                                                    onChange={(e) => handleRoomPricingChange({ type: 'monthly', value: e.target.value})}
                                                    placeholder={"Monthly Price"}
                                                    className="login-form-input-field p-2 w-75"
                                                    type="number"
                                                    // value={hotelEmailInput}
                                                /> 
                                                {
                                                    isEdit
                                                    ?
                                                        <button 
                                                            onClick={() => initiateRoomPricingChange({ inputId: 'monthly' })}
                                                            disabled={roomChangeReqs ? true : false}
                                                            style={{background: '#1F1F1F', opacity: roomChangeReqs ? 0.76 : 1}}
                                                            className="hotel-profile-main-admin-profile-btn border-0 px-3 py-2 mx-1 black-button"
                                                        >
                                                        {
                                                            roomChangeReqs 
                                                            ?
                                                                roomChangeReqs.changeType == 'monthly'
                                                                ?
                                                                    <span><Spinner size="sm" className="mx-2" /></span>
                                                                :
                                                                    <FaScrewdriverWrench size={15} />                                            
                                                            :
                                                                <FaScrewdriverWrench size={15} />
                                                        }
                                                        </button>                                                    
                                                    :
                                                        <></>
                                                }                                                 
                                                { 
                                                    monthlyPercentageValue && 
                                                        <div>
                                                            <p className="login-form-label my-2">
                                                                Discount value: {monthlyPercentageValue.discountValue}
                                                            </p>
                                                            <p className="login-form-label my-2">
                                                                Actual value: {monthlyPercentageValue.actualValue}
                                                            </p>                                                            
                                                        </div>
                                                }
                                                {
                                                    changeErrorMsg.errorMsg && changeErrorMsg.changeType == 'monthly'
                                                    ?
                                                        <p className="login-error-msg text-center my-2">
                                                            <CustomErrorMsg errorMsg={changeErrorMsg.errorMsg} noCenter={true} />
                                                        </p>
                                                    :
                                                        <></>                                    
                                                }                                                                                                                                              
                                            </div>                                                                                        
                                        </div>
                                    </div>
                                </div>                                                                                                                                                                                  
                            </div> 
                        </div>
                    </div>
                </div>  

                {
                    isEdit
                    ?
                        <button 
                            onClick={calculatePercentages}
                            className="mx-3 login-form-btn p-3 black-button"
                        >
                            <FaPercentage size={15} />
                            <span className="mx-2">Calculate Values</span>
                        </button> 
                    :
                        <div className="mx-3">
                            <div className="d-flex">
                                <button 
                                    onClick={proceed}
                                    className="login-form-btn p-3"
                                >
                                    Proceed
                                </button>

                                <button 
                                    onClick={calculatePercentages}
                                    className="mx-3 login-form-btn p-3 black-button"
                                >
                                    <FaPercentage size={15} />
                                    <span className="mx-2">Calculate Values</span>
                                </button>                                
                            </div>
                        </div>                     
                }             
            </div>
        </div>
    )
}