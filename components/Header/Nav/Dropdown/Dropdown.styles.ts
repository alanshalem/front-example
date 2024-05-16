import styled from 'styled-components';
import { v } from '../../../../styles/variables';

export const SDropdown = styled.div`
  background: #ffff;
  top: 30px;
  white-space: nowrap;
  padding: ${v.smSpacing};
  min-width: 100%;
  position: absolute;
`;

export const STreeItem = styled.div`
  text-align: left;
  padding: ${v.smSpacing};
`;

export const STreeChild = styled.div`
  margin-top: ${v.smSpacing};
  background: rgba(255, 255, 255, 0.2);
`;
