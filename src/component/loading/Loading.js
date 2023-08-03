import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";

export default function Loading({ loadingText }){
    return (
        <div className="fixed-bottom d-flex justify-content-center">
            <p className="custom-alert custom-alert-visible col-lg-12 text-lowercase login-form-btn m-0 py-2 rounded-0">
                <span><Spinner size="sm" className="mx-2" /></span>
                {loadingText}
            </p>
        </div>
    )
}