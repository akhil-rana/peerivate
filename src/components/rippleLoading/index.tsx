import './index.scss';

function RippleLoading() {
  return (
    <div>
      <svg className='rippleSvg' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <g id='anims'>
            <circle id='rp1' r='1em' />
            <circle id='rp2' r='1em' />
            <circle id='rp3' r='1em' />
          </g>
        </defs>
        <use xlinkHref='#anims' x='50%' y='50%' />
      </svg>
    </div>
  );
}

export default RippleLoading;
