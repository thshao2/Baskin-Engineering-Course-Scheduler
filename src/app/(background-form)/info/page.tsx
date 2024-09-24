import * as React from 'react';
import Box from '@mui/material/Box';
import InfoForm from '../components/forms/info-form/InfoForm';



export default function InitForm() {
  return (
    <>
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