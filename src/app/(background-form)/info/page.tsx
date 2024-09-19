import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import InfoForm from '../components/forms/info-form/InfoForm';



export default function InitForm() {
  return (
    <>
        {/* <CssBaseline /> */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <InfoForm/>
        </Box>
    </>

  );
}