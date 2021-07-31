import './index.scss';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Alert(props: any) {
  const timeout = props?.timeout || 5000;

  useEffect(() => {
    setTimeout(() => {
      if (props?.setShow) props?.setShow(false);
      if (props?.callBack) props?.callBack(); // to perform something when error is gone
    }, timeout);
  }, [props, timeout]);

  return (
    <div>
      {props?.show ? (
        <motion.div
          className='flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800'
          initial={{ translateX: '+30em' }}
          animate={{ translateX: '0em' }}
          transition={{
            duration: 0.5,
            ease: props.easingFunction || 'backIn',
          }}
          style={
            props?.addStyles || {
              position: 'absolute',
              top: '5em',
              right: '0.5em',
            }
          }
        >
          {props?.type === 'error' ? (
            <div className='flex items-center justify-center w-12 bg-red-500'>
              <svg
                className='w-6 h-6 text-white fill-current'
                viewBox='0 0 40 40'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z' />
              </svg>
            </div>
          ) : props?.type === 'warn' ? (
            <div className='flex items-center justify-center w-12 bg-yellow-400'>
              <svg
                className='w-6 h-6 text-white fill-current'
                viewBox='0 0 40 40'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z' />
              </svg>
            </div>
          ) : props?.type === 'info' ? (
            <div className='flex items-center justify-center w-12 bg-blue-500'>
              <svg
                className='w-6 h-6 text-white fill-current'
                viewBox='0 0 40 40'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z' />
              </svg>
            </div>
          ) : props?.type === 'success' ? (
            <div className='flex items-center justify-center w-12 bg-green-500'>
              <svg
                className='w-6 h-6 text-white fill-current'
                viewBox='0 0 40 40'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z' />
              </svg>
            </div>
          ) : null}

          <div className='px-4 py-2 -mx-3'>
            <div className='mx-3'>
              <span
                className={`font-semibold text-${
                  props?.type === 'error'
                    ? 'red'
                    : props?.type === 'warn'
                    ? 'yellow'
                    : props?.type === 'success'
                    ? 'green'
                    : props?.type === 'info'
                    ? 'blue'
                    : 'blue'
                }-500 dark:text-${
                  props?.type === 'error'
                    ? 'red'
                    : props?.type === 'warn'
                    ? 'yellow'
                    : props?.type === 'success'
                    ? 'green'
                    : props?.type === 'info'
                    ? 'blue'
                    : 'blue'
                }-400`}
              >
                Error
              </span>
              <p className='text-sm text-gray-600 dark:text-gray-200'>
                {props?.message || 'message'}
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
