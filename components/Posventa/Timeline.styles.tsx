import styled, { css } from 'styled-components';

// Estilos para el componente
export const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const StepContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  position: relative;
`;

export const StepIcon = styled.span`
  font-size: 18px;
  margin-right: 10px;
  ${({ status }) => {
    if (status === 'done') {
      return css`
        color: green;
      `;
    } else if (status === 'doing') {
      return css`
        color: orange;
      `;
    } else if (status === 'todo') {
      return css`
        color: blue;
      `;
    } else if (status === 'warning') {
      return css`
        color: yellow;
      `;
    } else if (status === 'error') {
      return css`
        color: red;
      `;
    }
  }}
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StepTitle = styled.h3`
  display: flex;
  align-items: center;
  margin: 0;
`;

export const StepDate = styled.span`
  font-size: 12px;
`;

export const StepText = styled.p`
  margin: 0;
  text-align: justify;
`;