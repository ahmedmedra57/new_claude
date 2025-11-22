// local
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// library dependencies
import styled from 'styled-components';
// components
import NavBar from './NavBar';
import Login from './Login';
import Features from './Features';
import About from './About';

import ContactForm from './ContactForm';
import LPFooter from './LPFooter';
import AboutUs from './AboutUs';
import Tempora from './tempora/Tempora';

const LandingPage = () => {
  const URL = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (URL.pathname === '/' || URL.pathname === '/login') {
      i18n.changeLanguage('en');
    } else if (URL.pathname === '/login/fr') {
      i18n.changeLanguage('fr');
    }
  }, [URL.pathname, i18n]);

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Wrapper>
      <div id='navbar'>
        <NavBar handleClickScroll={handleClickScroll} />
      </div>
      <div id='login'>
        <Login handleClickScroll={handleClickScroll} />
      </div>
      <div id='#features'>
        <Features />
      </div>
      <div id='#about'>
        <About />
      </div>
      <div id='#tempora'>
        <Tempora isEnglish={i18n.language === 'en'} />
      </div>
      <div id='#about-us'>
        <AboutUs isEnglish={i18n.language === 'en'} />
      </div>
      <div id='#contact'>
        <ContactForm />
      </div>
      <div id='#footer'>
        <LPFooter />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
`;

export default LandingPage;
