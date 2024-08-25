import * as React from 'react';
import Box from '@mui/joy/Box';
import CssBaseline from '@mui/material/CssBaseline';
import InfoForm from '../components/InfoForm';



export default function InitForm() {
  return (
    <>
        {/* <CssBaseline /> */}
        <Box
          sx={{
            display: 'flex',
            // alignContent: 'center',
            // textAlign: 'center',
            justifyContent: 'center',
            // height: '100vh',
            // overflowY: 'scroll',
            // scrollSnapType: 'y mandatory',
            // '& > div': {
            //   scrollSnapAlign: 'start',
            // },
          }}
        >
          <InfoForm/>
        </Box>
    </>

  );
}