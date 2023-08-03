import React, { useEffect, useRef } from 'react'
import './css/scroll.css'

export default function VerticalScroll(props){
    const scrollRef = useRef()

    useEffect(() => {
        if(props.scrollToTopCondition){
            scrollRef.current.scroll({
                top: 0,
                behavior: 'smooth'
              });
        }
      }, [props.scrollToTopCondition]);

    return (
        <div 
            ref={scrollRef}
            className='custom-vertical-scroll' style={{height: props.defaultHeight}}
        >
            {
                props.children
            }
        </div>
    )
}