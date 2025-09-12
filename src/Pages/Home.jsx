import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Stack,
  useTheme,
} from '@mui/material';
import { KingBed, Star, StarHalf, StarBorder } from '@mui/icons-material';
import AboutSection from '../Components/About';
import FacilitiesSection from '../Components/Facilities';
import NewSection from '../Components/Newsection';
import FacilitySection from '../Components/Facilities2';
import Testimonials from '../Components/Testimonials';
import LatestBlogPosts from '../Components/Blogssection';
import Banner from '../Components/Banner';

const rooms = [
  {
    title: 'Deluxe Double Rooms',
    image:
      'https://cdn.traveltripper.io/site-assets/512_863_12597/media/2018-02-22-041437/large_DDBDB.jpg',
    price: 260,
    size: '1500 SQ.FT',
    beds: '2 King Bed',
    rating: 4.5,
  },
  {
    title: 'Deluxe Double Rooms',
    image:
      'https://winhotelsgroup.nl/properties/hotel-notting-hill/images/rooms/single-deluxe-room/single-deluxe-room-1.jpg',
    price: 260,
    size: '1500 SQ.FT',
    beds: '2 King Bed',
    rating: 4,
  },
  {
    title: 'Deluxe Double Rooms',
    image:
      'https://bhutanhotels.com.bt/wp-content/uploads/2023/03/IMG_2482.jpg',
    price: 260,
    size: '1500 SQ.FT',
    beds: '2 King Bed',
    rating: 3.5,
  },
];

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)
      stars.push(<Star key={i} sx={{ color: '#c2a76d' }} />);
    else if (rating >= i - 0.5)
      stars.push(<StarHalf key={i} sx={{ color: '#c2a76d' }} />);
    else
      stars.push(<StarBorder key={i} sx={{ color: '#c2a76d' }} />);
  }
  return stars;
};

const Home = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <>
      <Banner />
      <Box
        sx={{
          py: 10,
          fontFamily: `'Playfair Display', serif`,
          backgroundColor: isDark ? '#121212' : '#fefbf5',
          px: { xs: 2, md: 10 },
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          mb={2}
          sx={{
            fontFamily: 'Playfair Display, serif',
            color: isDark ? '#fff' : '#000',
          }}
        >
          LUXORA ROOMS & SUITES
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          mb={6}
          sx={{
            color: isDark ? '#aaa' : '#777',
            fontFamily: `'Playfair Display', serif`,
          }}
        >
          Proactively morph optimal infomediaries rather than accurate expertise.
          Intrinsically progressive resources rather than resource-leveling.
        </Typography>

        <Grid container spacing={8} sx={{ justifyContent: 'center' }}>
          {rooms.map((room, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  position: 'relative',
                  backgroundColor: isDark ? '#1e1e1e' : '#fff',
                  color: isDark ? '#eee' : '#000',
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={room.image}
                  alt={room.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: '#c2a76d',
                    color: '#fff',
                    px: 2,
                    py: 0.5,
                    borderRadius: '2px',
                    fontWeight: 'bold',
                    fontSize: 14,
                  }}
                >
                  ${room.price} | NIGHT
                </Box>

                <CardContent
                  sx={{
                    backgroundColor: isDark ? '#2a2a2a' : '#fff',
                    textAlign: 'left',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#a88958' }}>
                    LUXURY ROOM
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mt={1}
                    sx={{
                      fontFamily: `'Playfair Display', serif`,
                      color: isDark ? '#fff' : '#000',
                    }}
                  >
                    {room.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: isDark ? '#aaa' : '#777', mb: 1 }}
                  >
                    {room.size}/Rooms
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <KingBed
                      fontSize="small"
                      sx={{ color: isDark ? '#ccc' : '#333' }}
                    />
                    <Typography variant="body2" sx={{ color: isDark ? '#ddd' : '#333' }}>
                      {room.beds}
                    </Typography>
                  </Stack>

                  <Box sx={{ mt: 1, display: 'flex' }}>{renderStars(room.rating)}</Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <AboutSection />
      <FacilitiesSection />
      <NewSection />
      <FacilitySection />
      <Testimonials />
      <LatestBlogPosts />
    </>
  );
};

export default Home;
