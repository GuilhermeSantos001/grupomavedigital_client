import styled, { css, keyframes } from 'styled-components';
import { zoomInDown } from 'react-animations';

import { AnimationDurationType } from '@/types/AnimationDurationType';

const ZoomAnimation = keyframes`${zoomInDown}`;

const ZoomAnimationDiv = styled('div') <{ duration: AnimationDurationType }>`
  ${props => props.duration && css`
    animation: ${props.duration} ${ZoomAnimation};
  `}
`;

export type Props = {
  duration: AnimationDurationType;
  children: React.ReactNode;
}

export function ZoomInDownDiv(props: Props) {
  return (
    <ZoomAnimationDiv duration={props.duration}>
      {props.children}
    </ZoomAnimationDiv>
  )
}