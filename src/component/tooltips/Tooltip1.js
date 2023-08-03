import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import './css/tooltip.css'

export default function Tooltip1({ toolTipText, id, children }){
    return (
        <OverlayTrigger 
            placement="auto" 
            id={id} 
            overlay={
                <Tooltip className="m-0 p-0 tool-tip-one">
                    <span className="tool-tip-one-text m-0 p-0">{toolTipText}</span>
                </Tooltip>
            }
        >
            {children}
        </OverlayTrigger>
    )
}