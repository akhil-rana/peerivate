import './index.scss';
// import phoneIcon from '../../../assets/images/callControls/phone-solid.svg';
import { PhoneIcon } from '@heroicons/react/solid';

function Button(props: any) {
  return (
    <button
      onClick={() => {
        // console.log('diss');
        props?.connection?.close();
      }}
      className='flex items-center p-4 m-auto transition ease-in duration-200 uppercase rounded-full bg-red-700 hover:bg-red-900   focus:outline-none'
    >
      <PhoneIcon className='h-8 inline-block text-white' />
    </button>
  );
}

export default Button;
