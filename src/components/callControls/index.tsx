import Button from './button';
import './index.scss';
import { useEffect } from 'react';

function CallControls(props: any) {
  useEffect(() => {
    (document.querySelector('body') as HTMLBodyElement).style.overflow =
      'hidden';
  }, []);

  return (
    <div className='call-controls-container'>
      <div className='call-controls-buttons-container'>
        <Button type='mic' action={props?.micToggleAction} />
        <Button type='camera' action={props?.cameraToggleAction} />
        <Button type='call' action={props?.callDisconnectAction} />
      </div>
    </div>
  );
}

export default CallControls;
