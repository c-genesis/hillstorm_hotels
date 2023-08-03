import React from "react";
import { Carousel } from "react-bootstrap";
import loginImg1 from '../../../images/loginpage/loginImg1.jpg'
import loginImg2 from '../../../images/loginpage/loginImg2.jpg'
import loginImg3 from '../../../images/loginpage/loginImg3.jpg'
import loginImg4 from '../../../images/loginpage/loginImg4.jpg'


const images = [
    {img: loginImg1, alt: 'first slide'}, 
    {img: loginImg2, alt: 'second slide'}, 
    {img: loginImg3, alt: 'third slide'},
    {img: loginImg4, alt: 'fourth slide'
}
]

export default function AuthCarousel(){

    const carouselItems = images.map((image, i) => {
        const { img, alt } = image
        return (
            <Carousel.Item key={i}>
                <img
                    className="login-image"
                    src={img}
                    alt="First slide"
                />
            </Carousel.Item>
        )
    })

    return (
        <Carousel 
            fade 
            interval={2200}
            controls={false}
        >
            { carouselItems }                                                                                                                                                                
        </Carousel>
    )
}