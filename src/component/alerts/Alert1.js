import React, { useEffect, useRef } from "react";
import './css/alert.css'

export default function ALert1({ customAlert, setAlertModal }){

    useEffect(() => {
        if(customAlert){
            const alertElement = document.querySelector('.custom-alert')
            if(alertElement){
                alertElement.classList.add('custom-alert-visible')
                const alertTimeout = setTimeout(()=> {
                    if(customAlert.callback){
                        customAlert.callback()
                    }
                    alertElement.classList.remove('custom-alert-visible')
                    clearTimeout(alertTimeout)                    
                    if(setAlertModal){
                        setAlertModal()
                    }                    
                }, customAlert.duration ? customAlert.duration : 2000)
            }
        }
    }, [customAlert])

    return (
        <div className="fixed-bottom d-flex justify-content-center">
            <p className="custom-alert col-lg-12 text-lowercase login-form-btn m-0 py-2 rounded-0">
                {customAlert && customAlert.message}
            </p>
        </div>
    )
    
}