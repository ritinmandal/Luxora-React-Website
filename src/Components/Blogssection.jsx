import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Button,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const posts = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80',
    title: 'Luxury Hotel for Travelling Spot USA, California',
    author: 'Royella',
    date: 'November 4, 2023',
  },
  {
    id: 2,
    image:
      'https://tse3.mm.bing.net/th/id/OIP.AN5orVdP9-VdsVVI44sujwHaE8?pid=Api&P=0&h=220',
    title: 'Feel Like Home on Your Business Trip in Hotel',
    author: 'Royella',
    date: 'November 4, 2023',
  },
  {
    id: 3,
    image:
      'https://cache.marriott.com/marriottassets/marriott/CUNLI/cunli-exterior-2363-hor-clsc.jpg',
    title: 'Top 5 Restaurants in a Quiet Malmo Street',
    author: 'Royella',
    date: 'November 4, 2023',
  },
];

const LatestBlogPosts = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        py: 10,
        px: 2,
        backgroundColor: theme.palette.background.default,
        textAlign: 'center',
        color: theme.palette.text.primary,
      }}
    >
      <Box sx={{ position: 'relative', mb: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 'bold',
            mb: 1,
            position: 'relative',
            zIndex: 2,
          }}
        >
          LATEST POST FROM BLOG
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 700,
            mx: 'auto',
            position: 'relative',
            zIndex: 2,
            color: theme.palette.text.secondary,
          }}
        >
          Proactively morph optimal infomediaries rather than accurate expertise. Intrinsically
          progressive resources rather than resource-leveling
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {posts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                elevation={3}
                sx={{
                  textAlign: 'left',
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                />
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 1, color: '#c59d5f' }}
                  >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PersonIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{post.author}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CalendarMonthIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{post.date}</Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontFamily: 'Playfair Display, serif',
                      color: theme.palette.text.primary,
                    }}
                  >
                    {post.title}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Box sx={{ mt: 6 }}>
          <Button
            variant="contained"
            href="/blog"
            sx={{
              backgroundColor: '#c59d5f',
              color: '#fff',
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              textTransform: 'none',
              fontFamily: 'Playfair Display, serif',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#b18a4f',
              },
            }}
          >
            Read More Blog Posts
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default LatestBlogPosts;
