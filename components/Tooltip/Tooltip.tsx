import React from 'react';
import { TooltipBox, TooltipCard, TooltipText } from './Tooltip.styles';

const Tooltip = (props: TooltipProps) => {
  return (
    <>
      <TooltipCard>
        <TooltipText>{props.children}</TooltipText>
        <TooltipBox>
          <p>{props.message}</p>
        </TooltipBox>
      </TooltipCard>
    </>
  );
};

export default Tooltip;

interface TooltipProps {
  children: any;
  message: any;
}
