import React from 'react';
import { Grid, Box, Typography, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const facilities = [
  {
    id: 1,
    title: 'Gym Training Grounds',
    category: 'Fitness',
    desc: 'Rapidiously myocardinate cross-platform intellectual capital after model. Appropriately create interactive infrastructures after are Holisticly facilitate stand-alone',
    image: 'https://www.technogym.com/wpress/wp-content/uploads/2015/03/Fitness-Centre-1.jpg',
  },
  {
    id: 2,
    title: 'Indoor Swimming Pool',
    category: 'Swimming Pool',
    desc: 'Rapidiously myocardinate cross-platform intellectual capital after model. Appropriately create interactive infrastructures after are Holisticly facilitate stand-alone',
    image: 'https://assets.vogue.com/photos/5f47ed5c423f63eeeba1f586/master/w_1600%2Cc_limit/FZ_Pool_01.jpg',
  },
  {
    id: 3,
    title: 'Fine Dining Center',
    category: 'Dining',
    desc: 'Experience world-class cuisines prepared by award-winning chefs in a luxurious setting. Enjoy gourmet meals from breakfast to dinner with a touch of elegance.',
    image: 'https://i.pinimg.com/originals/e4/ff/c2/e4ffc230696005aaeabb7f43ee5d9ae7.jpg',
  },
  {
    id: 4,
    title: 'Luxury Spa & Wellness',
    category: 'Spa',
    desc: 'Relax and rejuvenate in our full-service spa offering massages, facials, and holistic treatments designed to refresh your body and mind.',
    image: 'https://a.cdn-hotels.com/gdcs/production28/d818/3ec6bc99-018c-459f-9ce3-58f943479d49.jpg',
  },
];

const fadeInVariant = (direction = 'left') => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -100 : 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1 },
  },
});

const FacilitySection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ px: 4, py: 10, backgroundColor: theme.palette.background.default }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: '#b9925d',
          fontWeight: 600,
          mx: 20,
          ml: 0,
        }}
      >
        Facilities
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontFamily: 'Playfair Display, serif',
            color: theme.palette.text.primary,
            mb: { xs: 2, md: 0 },
          }}
        >
          ENJOY COMPLETE & BEST QUALITY FACILITIES
        </Typography>

        <Button
          variant="contained"
          sx={{
            bgcolor: '#b9925d',
            color: '#fff',
            pt: 2,
            pb: 2,
            px: 3,
            '&:hover': {
              bgcolor: '#a1784a',
            },
          }}
        >
          VIEW MORE ITEM
        </Button>
      </Box>

      <hr style={{ borderColor: isDark ? '#444' : '#ccc' }} />

      {facilities.map((item, index) => {
        const isEven = index % 2 === 0;
        const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

        return (
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
            direction={isEven ? 'row' : 'row-reverse'}
            sx={{ mt: 6 }}
            key={item.id}
          >
            <Grid item xs={12} md={6}>
              <motion.div
                variants={fadeInVariant(isEven ? 'left' : 'right')}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                <Box
                  ref={ref}
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    maxWidth: '500px',
                    height: '350px',
                    borderRadius: 2,
                    boxShadow: 4,
                    objectFit: 'cover',
                    mx: 'auto',
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                variants={fadeInVariant(isEven ? 'right' : 'left')}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#b9925d', fontWeight: 600, mx: 20 }}
                >
                  {item.category}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 'bold',
                    mt: 1,
                    mx: 20,
                    color: theme.palette.text.primary,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    mx: 20,
                    fontSize: '18px',
                    color: theme.palette.text.secondary,
                    width: '100%',
                    maxWidth: '500px',
                    fontStyle: 'italic',
                  }}
                >
                  {item.desc}
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
};

export default FacilitySection;
