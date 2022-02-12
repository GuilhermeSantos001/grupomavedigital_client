import { HeartSpinner } from 'react-spinners-kit';

export function BoxError() {
  return (
    <div className='d-flex flex-column fade-effect active'>
      <div className='d-flex justify-content-center p-2'>
        <p>Não foi possível carregar as informações. Tente novamente, mais tarde!</p>
      </div>
      <div className='d-flex justify-content-center p-2'>
        <p className="text-muted">
          Lamentamos o inconveniente.
        </p>
        <HeartSpinner size={32} color='#ff0000' />
      </div>
    </div>
  )
}