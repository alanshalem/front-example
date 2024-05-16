import React from 'react';
import { StepContainer, StepContent, StepDate, StepIcon, StepText, StepTitle, TimelineContainer } from './Timeline.styles';



// Componente de Timeline
const Timeline = ({ children }) => {
  return <TimelineContainer>{children}</TimelineContainer>;
};

// Componente de cada paso del Timeline
const Step = ({ status, title, date, text }) => {
  const getStatusEmoji = () => {
    if (status === 'done') {
      return '✔️';
    } else if (status === 'doing') {
      return '⏳';
    } else if (status === 'todo') {
      return '➡️';
    } else if (status === 'warning') {
      return '⚠️';
    } else if (status === 'error') {
      return '❌';
    } else {
      return '';
    }
  };

  return (
    <StepContainer>
      <StepIcon status={status}>{getStatusEmoji()}</StepIcon>
      <StepContent>
        <StepTitle>
          {/* {getStatusEmoji()} */}
          {title}
        </StepTitle>
        {date && <StepDate>{date}</StepDate>}
        {text && <StepText>{text}</StepText>}
      </StepContent>
    </StepContainer>
  );
};

// Componente principal
const WorkflowModalTimeline = ({ detalleWorkflow }) => {
  // Function to map the status values
  const mapStatus = (status) => {
    const statusMap = {
      Alta: 'todo',
      Procesado: 'done',
      Error: 'error',
    };
    return statusMap[status] || '';
  };

  return (
    <Timeline>
      {detalleWorkflow ? (
        detalleWorkflow.map((item, index) => (
          <Step
            key={index}
            title={item.workflow || 'Esta posventa no tiene Workflow'}
            text={item.resultado}
            status={mapStatus(item.descEstado)}
            date={item.fechaProceso}
          />
        ))
      ) : (
        <Step
          title={'Esta posventa no tiene Workflow'}
          text={''}
          status={''}
          date={''}
        />
      )}
    </Timeline>
  );
};

export default WorkflowModalTimeline;
