import './index.scss';
import { useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

function Card(props: any) {
  useEffect(() => {}, []);

  return (
    <motion.div
      className='Cards shadow-lg rounded-2xl w-64 p-4 py-6 bg-white'
      animate={{ translateX: props.animateTo }}
      initial={{ translateX: props.animateFrom }}
      transition={{ duration: 0.5, ease: props.easingFunction || 'backInOut' }}
      onAnimationComplete={() => {
        //fix extra bottom padding on mobile devices
        (document.querySelector('.Cards') as HTMLDivElement).style.transform =
          'unset';
      }}
      style={props.style}
    >
      <div className='flex flex-col items-center justify-center'>
        <p className='text-gray-800 text-xl font-medium mb-1'>
          {props.heading}
        </p>
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
          <div className='upperPortion'>{props.content}</div>
        )}

        <p className='text-gray-400 text-center text-xs px-2'></p>
      </div>
    </motion.div>
  );
}

export default Card;
