import { MagicSpinner } from 'react-spinners-kit';

export type Props = {
  height?: number
}

export function BoxLoadingMagicSpinner(props: Props) {
  return (
    <div className='d-flex flex-row justify-content-center align-items-center p-2 fade-effect active' style={{ height: props.height || 250 }}>
      <MagicSpinner size={42} color={"#004a6e"} />
    </div>
  )
}