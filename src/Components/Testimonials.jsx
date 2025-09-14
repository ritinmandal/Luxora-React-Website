import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/system';
import { useInView } from 'react-intersection-observer';

const backgroundImage =
  'https://wp.ditsolution.net/royella-multipurpose/wp-content/uploads/2023/11/testi-bg.jpg';

const QuoteCircle = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: '#c59d5f',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: -30,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
}));

const TestimonialCard = ({ name, role, text, image }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      style={{ position: 'relative' }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          p: 4,
          boxShadow: 5,
          maxWidth: 500,
          mx: 'auto',
          position: 'relative',
          mt: 5,
        }}
      >
        <QuoteCircle>
          <FormatQuoteIcon sx={{ color: '#fff', fontSize: 28 }} />
        </QuoteCircle>

        <Box sx={{ mb: 2, color: '#c59d5f' }}>
          {[...Array(5)].map((_, idx) => (
            <StarIcon key={idx} fontSize="small" />
          ))}
        </Box>

        <Typography
          variant="body1"
          fontStyle="italic"
          sx={{ mb: 3, color: theme.palette.text.secondary }}
        >
          {text}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar src={image} alt={name} sx={{ width: 50, height: 50, mr: 2 }} />
          <Box>
            <Typography fontWeight="bold" color={theme.palette.text.primary}>
              {name}
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              — {role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

const Testimonials = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <Box
      ref={ref}
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 10,
        px: 2,
        textAlign: 'center',
        color: isDark ? theme.palette.text.primary : '#fff',
        backdropFilter: 'brightness(0.8)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 'bold',
          mb: 2,
        }}
      >
        CUSTOMER’S TESTIMONIALL
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: 800,
          mx: 'auto',
          mb: 5,
          color: isDark ? theme.palette.text.secondary : '#ccc',
        }}
      >
        Proactively morph optimal infomediaries rather than accurate expertise.
        Intrinsically progressive resources rather than resource-leveling.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <TestimonialCard
            name="Allena Gomez"
            role="Customer"
            text="Professionally repurpose flexible testing procedures via molla in customer service. Dynamically reconceptualize value-added the systems before manufactured products. Enthusiastically envisioner emerging best."
            image="https://randomuser.me/api/portraits/women/44.jpg"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TestimonialCard
            name="John D. Alexon"
            role="Customer"
            text="Professionally repurpose flexible testing procedures via molla in customer service. Dynamically reconceptualize value-added the systems before manufactured products. Enthusiastically envisioner emerging best."
            image="https://randomuser.me/api/portraits/men/32.jpg"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Testimonials;
