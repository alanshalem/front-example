import React, { useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { IconSvg } from '@brick/core';

export const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 20px;
  max-width: 90%;
  max-height: 90%;
  box-shadow: 0 3px 15px -3px rgba(0, 0, 0, 0.2);
  position: relative;
`;

export const HeaderRow = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;
export const DivRow = styled.div`
  cursor: 'pointer'; 
  width: '30px';
`;

export const ScrollDisabler = createGlobalStyle`
  body {
    overflow-y: hidden;
  }
`;

export const Modal = ({ isOpen,close, children }) => {
  const contentRef = useRef();

  useEffect(() => {
    if (!isOpen) return null;

    function listener(evt) {
      if (contentRef.current?.contains(evt.target)) return;
      close();
    }

    window.addEventListener('click', listener);

    return () => {
      window.removeEventListener('click', listener);
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <>
      <Background>
        <Content ref={contentRef}>
          <HeaderRow>
            <DivRow>
              <IconSvg size="sm" type="close" color="darkGray" />
            </DivRow>
          </HeaderRow>
          {children}
        </Content>
      </Background>
      <ScrollDisabler />
    </>
  );
};

export default Modal;
