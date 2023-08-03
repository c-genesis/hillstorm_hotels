import React, { useEffect, useState , useRef } from 'react'
import styles from './trend.module.css'
import { trending } from '../../data'
import { street } from '../../data'
import ratting from '../../../images/ratting.svg'
import invinsibleline from '../../../images/invinsibleline.svg' 
import yellowline from '../../../images/yellowline.svg'
import axios from 'axios'
import Lottie from 'lottie-web'
import NoState from '../../noState/NoState'



function Trend({ allHotels }) {
  if(allHotels){

    const displayHotels = allHotels.data && allHotels.data.map((hotel, i) => {
      const { profileimg, coverimg, hotelname, hotelRooms, rating, state, city } = hotel

      // console.log(hotelRooms)

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

    return (
      <>
      <div className={styles.containerss}>
        <div className={styles.containerchild}>
          <div  className={styles.listing}>
            <p className={styles.seen}>NEED A PLACE TO STAY?</p>
            <p className={styles.whatis}>TRENDING HOTELS</p>
          </div>
          <div className={styles.general}>
            {
              displayHotels
            }
          </div>
        </div>
      </div>
  
      <div className={styles.carnival}>
        <div className={styles.carnivalone}>
          <p className={styles.carnivalheading}>INSPIRE YOUR NEXT TRAVEL</p>
          <div className={styles.shorterline}></div>
        </div>
        <div className={styles.carnivaltwo}>
          <div className={styles.carnivalmiddle}>
            <p className={styles.headder}>2023 Carnival Calabar</p>
            <p className={styles.paarr}>
              Lorem ipsum dolor sit amet consectetur. Tristique nisi eget et eu pellentesque. Accumsan turpis potenti turpis ut nibh a rhoncus. Semper nisi 
              pretium neque pellentesque bibendum turpis ipsum cras. Et elit turpis sociis sed suspendisse. 
              In nisl urna pellentesque ut habitant nec. Turpis amet.
            </p>
            <div className={styles.containingtwo}>
              <div className={styles.bookearly}>BOOK EARLY</div>
              <div className={styles.learnmore}>LEARN MORE</div>
            </div>
          </div>
        </div>
        <div className={styles.carnivalthree}></div>
      </div>
      </>
    )
  } else{
    return  <NoState />
  }
}

export default Trend