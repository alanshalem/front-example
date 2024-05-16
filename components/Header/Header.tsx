import React, { useState } from 'react';
import {
  SCenter,
  SHeader,
  SHeaderFixed,
  SHeaderHeight,
  SLeft,
  SLogo,
  SLogoLink,
  SRight,
} from './Header.styles';
import Nav from './Nav/Nav';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuToggleHandler = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
      <SHeaderHeight />
      <SHeaderFixed>
        <SHeader>
          <SLeft>
            <SLogoLink to="/">
              <SLogo>OASYS</SLogo>
            </SLogoLink>
            <Nav menuToggleHandler={menuToggleHandler} />
          </SLeft>
          <SCenter></SCenter>
          <SRight></SRight>
        </SHeader>
      </SHeaderFixed>
      {/* <SMenu></SMenu> */}
    </>
  );
};

export default Header;
