import './index.scss';
import Snackbar from '@material-ui/core/Snackbar';
import { useEffect, useState } from 'react';
import { SnackbarContent } from '@material-ui/core';

export default function SnackBar(props: any) {
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  const handleClose = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        // autoHideDuration={props.duration || 5000}
        onClose={handleClose}
      >
        <SnackbarContent
          style={
            props.style || {
              backgroundColor: 'white',
              color: 'black',
            }
          }
          message={props.content}
        />
      </Snackbar>
    </div>
  );
}
