import { animate, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import './index.scss';
import { CheckCircleIcon } from '@heroicons/react/outline';

function CopyToClipboardBox(props: any) {
  const [copied, setCopied] = useState(false);
  const [styling, setStyling] = useState(props.style);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(props.copy);
    setCopied(true);
    let styles = JSON.parse(JSON.stringify(styling || {}));
    styles.backgroundColor = '#008a006e'
    setStyling(styles);
    console.log(styling);
  }

  return (
    <div
      style={styling || {}}
      className='copyBox text-center align-middle border rounded-2xl border-black border-opacity-20 p-1 cursor-pointer'
      onClick={() => {
        copyToClipboard(props.copy);
      }}
    >
      {' '}
      <div className='copyBoxContent'>
        <span className='m-auto pr-4 pl-4'>{copied ? 'Copied' : props.text}</span>
        {copied ? (
          <CheckCircleIcon
            className='copyIcon h-5 w-5 inline-block relative -top-0.5'
            style={props.iconStyle}
          />
        ) : (
          <props.icon
            className='copyIcon h-5 w-5 inline-block relative -top-0.5'
            style={props.iconStyle}
          />
        )}
      </div>
    </div>
  );
}
export default CopyToClipboardBox;
