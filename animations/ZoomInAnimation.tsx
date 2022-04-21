import styled, { css, keyframes } from 'styled-components';
import { zoomIn } from 'react-animations';

import { AnimationDurationType } from '@/types/AnimationDurationType';

const ZoomAnimation = keyframes`${zoomIn}`;

const ZoomAnimationDiv = styled('div') <{ duration: AnimationDurationType }>`
  ${props => props.duration && css`
    animation: ${props.duration} ${ZoomAnimation};
  `}
`;

export type Props = {
  duration: AnimationDurationType;
  children: React.ReactNode;
}

export function ZoomInDiv(props: Props) {
  return (
    <ZoomAnimationDiv duration={props.duration}>
      {props.children}
    </ZoomAnimationDiv>
  )
}