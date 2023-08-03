import React from "react";
import Nav from '../nav/nav';
import Hero from "../hero/hero";
import Trend from "../trend/trend";
import Footer from "../footer/footer";
import styles from './homecompiler.module.css'

function Apptrying({ user, setUser, allHotels, setActiveHotel, navigateTo }) {
  return (
      <div className={styles.Apptrying}>
        <Nav 
          navigateTo={navigateTo}
          user={user}
          setUser={setUser}
        />
        <Hero 
          allHotels={allHotels}
          setActiveHotel={setActiveHotel}
        />
        <Trend 
          allHotels={allHotels}
        />
        <Footer />
      </div>
  );
}

export default Apptrying;
