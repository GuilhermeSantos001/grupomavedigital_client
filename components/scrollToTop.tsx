/**
 * @description Componente que permite retornar a parte superior da pagina
 * @author GuilhermeSantos001
 * @credits Skillthrive (https://www.youtube.com/watch?v=Xz2Z8xKH-R0) & Gautam Kumar (https://www.coderomeos.org/scroll-to-top-of-the-page-a-simple-react-component)
 * @update 29/12/2021
 */

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

const ScrollToTop = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={`d-flex fixed-top justify-content-end fade-effect m-2 ${isVisible ? 'active': 'deactivate'}`}>
      <div className='hover-color-scrollToTop' onClick={scrollToTop}>
        <FontAwesomeIcon
          icon={Icon.render('fas', 'caret-square-up')}
          className="m-auto fs-1 flex-shrink-1"
        />
      </div>
    </div>
  );
}

export default ScrollToTop;