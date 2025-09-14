import React from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';
import { Star, StarHalf } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';
const bannerData = [
  {
    image: 'https://wp.ditsolution.net/royella-multipurpose/wp-content/uploads/2023/11/hero-bg2.jpg',
    title: 'THE BEST LUXURY HOTEL IN INDIA',
    subtitle: 'LUXURY HOTEL AND RESORT',
  },
  {
    image: 'https://wp.ditsolution.net/royella-multipurpose/wp-content/uploads/2023/12/hero-bg.jpg',
    title: 'EXPERIENCE ELEGANCE & COMFORT',
    subtitle: 'WELCOME TO ROYAL LUXORA SUITES',
  },
];

const Banner = () => {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop
      speed={1200}
      style={{ height: '100vh' }}
    >
      {bannerData.map((banner, index) => (
        <SwiperSlide key={index}>
          <Box
            sx={{
              height: '100vh',
              backgroundImage: `url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
              px: 2,
              position: 'relative',
              zIndex: 1,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
              },
            }}
          >
            <Fade in timeout={800}>
              <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                <Star sx={{ color: '#c2a76d' }} />
                <Star sx={{ color: '#c2a76d' }} />
                <Star sx={{ color: '#c2a76d' }} />
                <Star sx={{ color: '#c2a76d' }} />
                <StarHalf sx={{ color: '#c2a76d' }} />
              </Box>
            </Fade>

            <Fade in timeout={1200}>
              <Typography variant="subtitle2" sx={{ letterSpacing: 2, fontSize: '1.2rem',marginBottom: 5 ,                  fontFamily: `'Playfair Display', serif`,
}}>
                {banner.subtitle}
              </Typography>
            </Fade>

            <Fade in timeout={1600}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 6,                  fontFamily: `'Playfair Display', serif`,
 }}>
                {banner.title}
              </Typography>
            </Fade>

            <Fade in timeout={2000}>
              <Link to="/about">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#c2a76d',
                                    fontFamily: `'Playfair Display', serif`,

                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  marginBottom: 20,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#a88958',
                  },
                }}
              >
                DISCOVER MORE
              </Button>
              </Link>
              
            </Fade>
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
