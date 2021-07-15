import './index.scss';
import { useParams } from 'react-router-dom';
// import { useState } from 'react';
import RippleLoading from '../../components/rippleLoading';
// import SnackBar from '../../components/snackBar';

function CallPage(props: any) {
  const { type } = useParams<{ id: string; type: string }>();

  return (
    <div>
      {type === 'call' ? (
        <div className='flex align-middle justify-center h-screen'>
          <div className='m-auto text-center'>
            <span className='font-sans font-medium text-4xl'>Calling...</span>
            <div className='flex align-middle justify-center'>
              <RippleLoading />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CallPage;
