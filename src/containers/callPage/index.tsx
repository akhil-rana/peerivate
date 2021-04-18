import './index.scss';
import { useParams } from 'react-router-dom';
import React from 'react';
import RippleLoading from '../../components/rippleLoading';

function CallPage(props: any) {
  const { id, type } = useParams<{ id: string; type: string }>();

  return (
    <div>
      {type === 'call' ? (
        <div className='flex align-middle justify-center h-screen'>
          <div className='m-auto text-center'>
            <span className='font-sans font-medium text-4xl'>Calling {id}</span>
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
