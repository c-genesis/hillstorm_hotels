import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ condition }) => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  useEffect(() => {
    if(condition){
      window.scrollTo(0, 0);
    }
  }, [condition]);
}

export default ScrollToTop;