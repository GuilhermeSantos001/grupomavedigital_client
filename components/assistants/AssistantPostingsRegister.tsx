/**
 * @description Assistente -> Registro de Lançamento Financeiro
 * @author GuilhermeSantos001
 * @update 24/01/2022
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

declare interface Step {
  label: string
  component: React.ReactElement
  completed: boolean
}

export interface Props {
  steps: Step[]
  step: number,
  finish: boolean,
  prevStepEnabled: boolean
  nextStepEnabled: boolean
  onChangeStep: (step: number) => void
  onPrevStep: () => void
  onNextStep: () => void
  handleFinish: () => void
}

export function AssistantPostingsRegister(props: Props): JSX.Element {
  return (
    <Box className='my-2' sx={{ width: '100%' }}>
      <Stepper activeStep={props.step} alternativeLabel>
        {props.steps.map((step) => (
          <Step completed={step.completed} key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {props.steps.find((step) => step.label === props.steps[props.step].label)?.component}
      <div className='d-flex flex-row justify-content-between p-2'>
        <Button
          className='mx-2'
          variant="contained"
          disabled={props.finish || !props.prevStepEnabled && !props.finish}
          onClick={() => {
            props.onChangeStep(props.step - 1);
            props.onPrevStep();
          }}
        >
          Voltar
        </Button>
        <Button
          className='mx-2'
          variant="contained"
          disabled={props.finish || !props.nextStepEnabled && !props.finish}
          onClick={() => {
            if (props.step === props.steps.length - 1) {
              props.handleFinish();
            } else {
              props.onChangeStep(props.step + 1);
              props.onNextStep();
            }
          }}
        >
          {props.step === props.steps.length - 1 ? 'Finalizar' : 'Avançar'}
        </Button>
      </div>
    </Box>
  );
}