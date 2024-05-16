import { Link } from '@reach/router';
import styled from 'styled-components';
import { b, v } from '../../styles/variables';

export const SHeaderHeight = styled.div`
  height: ${v.headerHeight};
`;

export const SHeaderFixed = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: ${v.headerHeight};
  background: #fff;
  z-index: 100;
`;

export const SHeader = styled.header`
  margin: 0 auto;
  height: 100%;
  width: 100%;
  max-width: 1920px;
  display: flex;
  align-items: center;
  transition: 0.3s ease padding;
  padding: 0 ${v.mdSpacing};
`;

export const SLeft = styled.div`
  display: flex;
  flex: auto;
`;

export const SCenter = styled.div`
  height: 100%;
  align-items: center;
  justify-content: center;
  display: none;
  @media ${b.md} {
    display: flex;
  }
`;
export const SRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

// Left
export const SLogoLink = styled(Link)`
  display: flex;
  color: inherit;
  text-decoration: none;
  margin-right: 20px;
`;
export const SLogo = styled.h2`
  color: #fc5404;
  text-transform: uppercase;
  font-weight: bold;
  font-size: large;
  display: block;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`;

// MENU
export const SMenu = styled.div`
  position: fixed;
  top: ${v.headerHeight};
  left: 100%;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.overlay};
  width: 100%;
  height: calc(100% - ${v.headerHeight});
  transition: 0.3s ease left;
  padding: ${v.lgSpacing};
  @media ${b.md} {
    display: none;
  }
`;
