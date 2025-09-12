import React from 'react';
import { Box, Typography } from '@mui/material';

const CartBanner = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: 'url(https://parador-react.wpocean.com/static/media/page-title.7bf035e9037d9b2173f7.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: { xs: 200, md: 300 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      <Typography
        variant="h3"
        sx={{
          position: 'relative',
          color: 'white',
          zIndex: 1,
          fontWeight: 'bold',
          textTransform: 'capitalize',
          fontFamily: `'Playfair Display', serif`,
        }}
      >
        Cart
      </Typography>
    </Box>
  );
};

export default CartBanner;
