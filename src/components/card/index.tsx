import './index.scss';
import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { LoadingOutlined } from '@ant-design/icons';

function Card(props: any) {
  const animatedProps = useSpring({transform: 'translate3d(0, 0, 0)', from: {transform: 'translate3d(-100em, 0, 0)'}})
  return (
    <animated.div style={animatedProps}>
      <div className='shadow-lg rounded-2xl w-64 p-4 py-6 bg-white m-auto'>
        <div className='flex flex-col items-center justify-center'>
          {props.loading ? (
            <div
              style={{
                height: '148px',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <LoadingOutlined style={{ fontSize: 50 }} spin />
            </div>
          ) : (
            <div className='upperPortion'>{props.upperPortion}</div>
          )}
          <p className='text-gray-800 text-xl font-medium mb-4 mt-4'>
            {props.heading}
          </p>
          <p className='text-gray-400 text-center text-xs px-2'></p>
        </div>
      </div>
    </animated.div>
  );
}

export default Card;
