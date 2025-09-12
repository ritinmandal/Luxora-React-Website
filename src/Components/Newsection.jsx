import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Dialog,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

const Newsection = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleVideoOpen = () => setVideoOpen(true);
  const handleVideoClose = () => setVideoOpen(false);

  return (
    <Box sx={{ py: 8, mt: -28, display: 'flex' }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: '1500px',
          margin: '0 auto',
          mt: 10,
          px: 4,
          py: 6,
          backgroundColor: isDark ? '#1e1e1e' : '#f9f6f2',
          color: isDark ? '#f5f5f5' : 'inherit',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left Text Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              style={{ width: '500px' }}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: '#b1976b', fontWeight: 600, mb: 1 }}
              >
                MANAGER
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  fontFamily: `'Playfair Display', serif`,
                }}
              >
                LUXURY BEST HOTEL IN CALIFORNIA, USA
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: isDark ? 'grey.400' : '#555',
                  mb: 2,
                  width: '500px',
                }}
              >
                Rapidiously myocardinate cross-platform intellectual capital after
                model. Appropriately create interactive infrastructures after main
                holistically facilitate stand-alone inframe. Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Quae esse maxime dolore odit
                ipsa iste fugiat. Consectetur suscipit dicta facilis!
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 3,
                  color: isDark ? 'grey.300' : '#444',
                  textDecoration: 'underline',
                }}
              >
                “ Model. Appropriately create interactive infrastructures after main
                Holistically facilitate stand-alone inframe of the world ”
              </Typography>

              <Box display="flex" alignItems="center" mt={4}>
                <Avatar
                  src="../../public/photo_2025-07-25_22-56-11.jpg"
                  alt="John D. Alexon"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>Ayush Bagchi</Typography>
                  <Typography variant="caption" color={isDark ? 'grey.400' : 'text.secondary'}>
                    Manager
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                  width: '100%',
                  height: '100%',
                  minHeight: '350px',
                }}
              >
                <Box
                  component="img"
                  src="https://images.adsttc.com/media/images/6359/9362/dc64/c847/b353/2c8e/large_jpg/a-tropical-resort-in-indonesia-and-a-countryside-villa-in-birmingham-9-unbuilt-interior-design-projects-submitted-to-archdaily_31.jpg?1666814860"
                  alt="Luxury Room"
                  sx={{
                    width: '500px',
                    height: '400px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                <Box
                  onClick={handleVideoOpen}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 60,
                    height: 60,
                    bgcolor: '#d4af7f',
                    color: '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 3,
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 32 }} />
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={videoOpen} onClose={handleVideoClose} maxWidth="md">
        <Box position="relative" sx={{ bgcolor: 'black' }}>
          <IconButton
            onClick={handleVideoClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: '#fff',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="iframe"
            width="600px"
            height="500px"
            src="https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1"
            title="Luxury Hotel Tour"
            allow="autoplay; encrypted-media"
            allowFullScreen
            sx={{ border: 'none' }}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default Newsection;
