import React from 'react';
import { RadioButton } from '@brick/core';
import styled from 'styled-components';

const RadioButtonGroupContainer = styled.div`
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const RadioButtonWrapper = styled.div`
  margin: 5px;
`;

export const createRadioButtonGroup = (
  value: string,
  options: any[],
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void,
  checkedField: string,
  disabled: boolean
) => (
  <RadioButtonGroupContainer>
    <RadioButton.Group
      value={value}
      onChange={e => handleChange(e, checkedField)}
      lineSpacing="20px"
    >
      {options.map(option => (
        <RadioButtonWrapper key={option.value}>
          <RadioButton
            key={option.value}
            label={option.text}
            value={option.value}
            checked={value === option.value}
            disabled={disabled}
          />
        </RadioButtonWrapper>
      ))}
    </RadioButton.Group>
  </RadioButtonGroupContainer>
);
