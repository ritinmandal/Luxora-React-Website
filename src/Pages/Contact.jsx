import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';

const MotionBox = motion(Box);

const services = ['Rooms', 'Dining', 'Pool', 'Spa', 'Gym', 'Other'];

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'We will contact you soon.',
      confirmButtonColor: '#c8a166',
    });
    setForm({ name: '', email: '', service: '', message: '' });
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        py: 8,
        px: { xs: 2, md: 12 },
        transition: 'all 0.3s ease',
      }}
    >
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={6} sx={{ mx:'40px', width: '500px', mt: 7, ml: '40px' }}>
          <MotionBox
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            sx={{mx:'40px', pr: { md: 6 } }}
          >
            <Typography variant="overline" sx={{ color: '#bda67f', fontSize: 12 }}>
              CONTACT US
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, fontFamily: 'serif', mb: 2 }}>
              CONTACT WITH US
            </Typography>
            <Typography sx={{ mb: 4, color: theme.palette.text.secondary }}>
              Rapidiously myocardinate cross-platform intellectual capital after the model. Appropriately create interactive infrastructures after
              maintance Holisticly facilitate stand-alone
            </Typography>

            {[
              { icon: <PhoneIcon />, title: 'Call Us Now', detail: '+980 123 (4567) 890' },
              { icon: <EmailIcon />, title: 'Sent Email', detail: 'example@gmail.com' },
              {
                icon: <LocationOnIcon />,
                title: 'Our Locations',
                detail: 'New elephant Road, Dhanmondi\nDhaka - 1212',
              },
            ].map(({ icon, title, detail }, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    
                    width: 50,
                    height: 50,
                    bgcolor: isDark ? '#2c2c2c' : '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 1,
                    mr: 2,
                  }}
                >
                  {icon}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {title}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {detail}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ mt: 2 }} />
          </MotionBox>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mx:'40px',mt: 7, width: '600px' }}>
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            sx={{
              bgcolor: isDark ? '#1e1e1e' : '#1a1a1a',
              color: '#fff',
              p: 4,
              borderRadius: 2,
              height: '100%',
              transition: 'all 0.3s ease',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontFamily: 'serif', mb: 3 }}
              align="center"
            >
              GET IN TOUCH
            </Typography>

            {['name', 'email'].map((field) => (
              <TextField
                key={field}
                fullWidth
                placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                name={field}
                value={form[field]}
                onChange={handleChange}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  style: { color: '#fff' },
                }}
                sx={{
                  bgcolor: '#2c2c2c',
                  mb: 2,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                }}
              />
            ))}

            <TextField
              fullWidth
              select
              placeholder="Select Services"
              name="service"
              value={form.service}
              onChange={handleChange}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { color: '#fff' },
              }}
              sx={{
                bgcolor: '#2c2c2c',
                mb: 2,
                px: 2,
                py: 1,
                borderRadius: 1,
              }}
            >
              <MenuItem value="" disabled>Select Services</MenuItem>
              {services.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { color: '#fff' },
              }}
              sx={{
                bgcolor: '#2c2c2c',
                mb: 3,
                px: 2,
                py: 1,
                borderRadius: 1,
              }}
            />

            <Button
              fullWidth
              onClick={handleSubmit}
              sx={{
                bgcolor: '#c8a166',
                color: '#fff',
                fontFamily:'Playfair Display, serif',
                fontWeight: 600,
                borderRadius: 1,
                '&:hover': { bgcolor: '#b88c55' },
              }}
            >
              SEND MESSAGE
            </Button>
          </MotionBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contact;
