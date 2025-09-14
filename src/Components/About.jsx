import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
} from '@mui/material';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Luxury Rooms', value: '250+' },
  { label: 'Customers Rating', value: '4.9' },
  { label: 'Happy Customers', value: '12k+' },
];
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const AboutSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();


  return (
    <Box
      sx={{
        backgroundColor: isDark ? '#121212' : '#fff',
        py: 10,
        px: { xs: 2, md: 10 },
        color: isDark ? '#f5f5f5' : '#000',
      }}
    >
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={7}>
          <Motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: isDark ? 4 : 3,
              }}
            >
              <Box
                component="img"
                src="https://wp.ditsolution.net/royella-multipurpose/wp-content/uploads/2023/11/about-thumb-2.jpg"
                alt="About"
                sx={{
                  width: '100%',
                  height: { xs: '300px', md: '450px' },
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          </Motion.div>
        </Grid>

        <Grid item xs={12} md={5}>
          <Motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="caption"
              sx={{ color: '#b79c60', letterSpacing: 2 }}
            >
              LUXURY HOTEL AND RESORT
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              my={2}
              sx={{ fontFamily: `'Playfair Display', serif` }}
            >
              LUXURY BEST HOTEL IN CITY <br /> CALIFORNIA, USA
            </Typography>

            <Typography
              variant="body1"
              color={isDark ? 'grey.400' : 'text.secondary'}
              mb={3}
            >
              Rapidiously myocardinate cross-platform intellectual capital after
              marketing assets. Compellingly create.
            </Typography>

            <Motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
            >
              <Grid container spacing={3} mb={3}>
                {stats.map((item, i) => (
                  <Grid item xs={4} key={i}>
                    <Motion.div variants={statItemVariants}>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                          color: '#b79c60',
                          fontFamily: `'Playfair Display', serif`,
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={isDark ? 'grey.400' : 'text.secondary'}
                        sx={{ fontFamily: `'Playfair Display', serif` }}
                      >
                        {item.label}
                      </Typography>
                    </Motion.div>
                  </Grid>
                ))}
              </Grid>
            </Motion.div>

            <Button
              variant="contained"
              onClick={()=>navigate('/about')}
              sx={{
                backgroundColor: '#b79c60',
                fontFamily: `'Playfair Display', serif`,
                borderRadius: 0,
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                color: '#fff',
                '&:hover': {
                  backgroundColor: isDark ? '#9e8144' : '#a88d4f',
                },
              }}
            >
              ABOUT MORE
            </Button>
          </Motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutSection;
