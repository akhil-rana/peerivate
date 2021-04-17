import './index.scss';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

function Card(props: any) {
  useEffect(() => {}, []);

  return (
    <motion.div
      className='shadow-lg rounded-2xl w-64 p-4 py-6 bg-white'
      animate={{ translateX: props.animateTo }}
      initial={{ translateX: props.animateFrom }}
      transition={{ duration: 0.5, ease: props.easingFunction || 'backInOut' }}
      style={props.style}
    >
      <div className='flex flex-col items-center justify-center'>
        {props.loading ? (
          <div
            style={{
              height: '148px',
              display: 'flex',
              alignItems: 'center',
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
    </motion.div>
  );
}

export default Card;
