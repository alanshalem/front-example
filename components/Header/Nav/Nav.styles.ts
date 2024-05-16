import { Link } from '@reach/router';
import styled from 'styled-components';
import { v } from 'styles/variables';

export const SNav = styled.nav`
  width: auto;
  padding: ${v.mdSpacing};
  background: #ffffff;
  border-radius: ${v.borderRadius};
  display: flex;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
`;

export const SNavLinkContainer = styled.div`
  user-select: none;
  position: relative;
  justify-content: space-between;
  :not(:last-of-type) {
    margin-bottom: 0;
    margin-right: ${v.mdSpacing};
  }
`;

export const SNavLink = styled(Link)`
  text-decoration: none;
  color: black !important;
  :hover {
    color: ${({ theme }) => theme.primary};
  }
`;

export const SArrowContainer = styled.div`
  svg {
    color: ${({ isOpen, theme }) => (!isOpen ? 'inherit' : theme.primary)};
  }
`;

export const SNavLabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
export const SNavLabel = styled.span`
  color: ${({ isOpen, theme }) => (!isOpen ? 'inherit' : theme.primary)};
`;
