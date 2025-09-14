// (Header Imports stay the same)
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Avatar,
  Stack,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DiamondIcon from '@mui/icons-material/Diamond';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const SectionTitle = ({ eyebrow, title, desc, align = 'center' }) => (
  <Stack mb={6} textAlign={align} component={motion.div} variants={fadeInUp}>
    {eyebrow && (
      <Typography
        variant="overline"
        sx={{ letterSpacing: 2, color: '#bfa26c', fontWeight: 700 }}
      >
        {eyebrow}
      </Typography>
    )}
    <Typography
      variant="h4"
      sx={{
        fontFamily: `'Playfair Display', serif`,
        fontWeight: 700,
        color: 'text.primary',
      }}
    >
      {title}
    </Typography>
    {desc && (
      <Typography variant="body1" color="text.secondary" mt={1} maxWidth={760} mx={align === 'center' ? 'auto' : 0}>
        {desc}
      </Typography>
    )}
  </Stack>
);

const AboutUs = () => {
  const theme = useTheme();
  const Navigate = useNavigate();

  const stats = [
    { label: 'Luxury Rooms', value: '250+' },
    { label: 'Customer Rating', value: '4.9' },
    { label: 'Happy Customers', value: '12k+' },
    { label: 'Staff Members', value: '300+' },
  ];

  const values = [
    { icon: <DiamondIcon />, title: 'Timeless Luxury', desc: 'Every touchpoint exudes class—crafted for discerning travelers.' },
    { icon: <AutoAwesomeIcon />, title: 'Personalization', desc: 'We tailor every experience to your unique preferences.' },
    { icon: <CheckCircleIcon />, title: 'Excellence', desc: 'Relentless pursuit of perfection in service & detail.' },
    { icon: <EmojiEventsIcon />, title: 'Integrity', desc: 'Honest, transparent, and guest-first always.' },
  ];

  const journey = [
    { year: '2015', title: 'The Dream Begins', text: 'Ritz Luxe Hotels was born from a shared vision of redefining luxury hospitality.' },
    { year: '2017', title: 'First Flagship Property', text: 'We opened our first flagship property, setting new benchmarks in service excellence.' },
    { year: '2020', title: 'Global Recognition', text: 'Recognized among the top boutique luxury chains with a 4.9 guest rating.' },
    { year: '2024', title: 'Sustainability First', text: 'Introduced eco-conscious hospitality initiatives across all properties.' },
  ];

  const team = [
    {
      name: 'Ritin Mandal',
      role: 'Founder & CEO',
      image: '/photo_2025-07-25_22-56-14.jpg',
    },
    {
      name: 'Ayush Bagchi',
      role: 'General Manager',
      image: '/photo_2025-07-25_22-56-11.jpg',
    },
    {
      name: 'Subhradeep Nath',
      role: 'Travel Expert',
      image: '/photo_2025-07-25_22-56-17.jpg',
    },
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#0f0f0f' : '#f7f7f7', color: 'text.primary' }}>

      <Box
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '95vh' },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: "url('https://c.wallhere.com/photos/b9/93/landscape_tropical_hotel_sea-225624.jpg!d')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 100%)',
        }} />
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <MotionTypography
              variant="overline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              sx={{ letterSpacing: 4, color: '#bfa26c', fontWeight: 700 }}
            >
              lUXORA HOTELS
            </MotionTypography>

            <MotionTypography
              variant="h2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              sx={{
                fontFamily: `'Playfair Display', serif`,
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.1,
                maxWidth: 900,
              }}
            >
              Crafting Premium Stays with Soul, Story & Style
            </MotionTypography>

            <MotionTypography
              variant="body1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 700 }}
            >
              Immerse yourself in curated luxury—where every detail is intentional and every moment feels made for you.
            </MotionTypography>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              sx={{ display: 'flex', gap: 2, mt: 3 }}
            >
              <Button
                onClick={() => Navigate('/rooms')}
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#bfa26c',
                  color: '#000',
                  px: 4,
                  py: 1.5,
                  borderRadius: 999,
                  '&:hover': { bgcolor: '#d0b37a' },
                }}
              >
                Book Your Stay
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.5)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 999,
                }}
              >
                Explore Our Story
              </Button>
            </MotionBox>
          </Stack>
        </Container>
      </Box>

      
    


      <Container sx={{ py: { xs: 8, md: 12 } }} component={motion.div} variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <SectionTitle
          eyebrow="Who We Are"
          title="Luxury, Reimagined With Human Touch"
          desc="At Ritz Luxe, we merge time-honored hospitality with forward-thinking design. Every experience we craft is a love letter to elegance, culture, and comfort."
        />

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox variants={fadeInUp}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2,fontFamily: `'Playfair Display', serif` }}>
                The Philosophy
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                We believe true luxury is not loud—it's the gentle assurance that your desires are anticipated and your experiences are elevated.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Our team of passionate hoteliers curate moments that resonate beyond the stay. From bespoke dining to curated city tours—we take hospitality personally.
              </Typography>
              <Stack direction="row" spacing={1} mt={3} flexWrap="wrap">
                {['Bespoke Service', 'Design-first Spaces', 'Eco-conscious', 'Data-driven CX'].map((chip) => (
                  <Chip key={chip} label={chip} variant="outlined" sx={{ borderColor: '#bfa26c', color: '#bfa26c', mr: 1, mb: 1 }} />
                ))}
              </Stack>
            </MotionBox>
          </Grid>
          
        </Grid>
      </Container>

      <Box flex={1} sx={{ py: { xs: 2000, md: 12 }, background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fff' }}>
        <Container component={motion.div} variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <SectionTitle
            eyebrow="Our North Star"
            title="Mission & Vision"
            desc="A future where hospitality is soulful, sustainable, and seamlessly personalized."
          />

          <Grid container spacing={4}>
            {[
              {
                title: 'Our Mission',
                img: 'https://c.wallhere.com/photos/83/f2/Pacific_Ocean_hotel_sea_coast_swimming_pool_tropical-186656.jpg!d',
                text: 'To orchestrate elevated stays that feel effortless—powered by people, technology, and empathy.',
              },
              {
                title: 'Our Vision',
                img: 'https://c.wallhere.com/images/87/e5/a36f9f97e9e0c1a251554ad094f1-2076981.jpg!d',
                text: 'To be the world’s most loved boutique luxury brand—renowned for warmth, craft, and character.',
              },
            ].map((item, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <MotionBox variants={fadeInUp}>
                  <Card sx={{
                    borderRadius: 4,
                    height: '100%',
                    overflow: 'hidden',
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#fff',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
                  }}>
                    <CardMedia component="img" image={item.img} alt={item.title} sx={{ height: 280, objectFit: 'cover',width: '1700px' }} />
                    <CardContent>
                      <Typography variant="h5" sx={{ fontFamily: `'Playfair Display', serif`, fontWeight: 600, mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">{item.text}</Typography>
                    </CardContent>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 8, md: 12 } }} component={motion.div} variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <SectionTitle
          eyebrow="What We Stand For"
          title="Our Core Values"
          desc="The principles that shape every decision, every touchpoint, every stay."
        />
        <Grid container spacing={4}>
          {values.map((v, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <MotionBox variants={fadeInUp} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 200 }}
                sx={{
                  height: '100%',
                  width: '500px',
                  p: 3,
                  marginLeft: '50px',
                  borderRadius: 3,
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                <Box sx={{ color: '#bfa26c' }}>{v.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{v.title}</Typography>
                <Typography variant="body2" color="text.secondary">{v.desc}</Typography>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: { xs: 8, md: 12 }, background: theme.palette.mode === 'dark' ? '#111' : '#fff' }}>
        <Container component={motion.div} variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <Grid container spacing={4} justifyContent="center" textAlign="center">
            {stats.map((s, i) => (
              <Grid key={i} item xs={6} md={3}>
                <MotionTypography
                  variants={fadeInUp}
                  variant="h3"
                  sx={{
                    color: '#bfa26c',
                    fontFamily: `'Playfair Display', serif`,
                    fontWeight: 700,
                  }}
                >
                  {s.value}
                </MotionTypography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 8, md: 12 } }} component={motion.div} variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <SectionTitle
          eyebrow="Our Journey"
          title="Milestones That Shaped Us"
          desc="A timeline of passion, persistence, and pursuit of hospitality excellence."
        />
        <Grid container spacing={4}>
          {journey.map((j, idx) => (
            <Grid key={idx} item xs={12} md={6}>
              <MotionBox variants={fadeInUp} sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="h3" sx={{ fontFamily: `'Playfair Display', serif`, color: '#bfa26c', minWidth: 90 }}>
                  {j.year}
                </Typography>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{j.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{j.text}</Typography>
                </Box>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      

      <Container sx={{ py: { xs: 8, md: 12 } }} component={motion.div} variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <SectionTitle
          eyebrow="Leadership"
          title="Meet Our Team"
          desc="The minds and hearts behind our signature hospitality. (Images from your public folder)"
        />

        <Grid container spacing={4} justifyContent="center">
          {team.map((member, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <MotionBox variants={fadeInUp} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 200 }}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: 'center',
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }}
              >
                <Avatar src={member.image} alt={member.name} sx={{ width: 110, height: 110, mx: 'auto', mb: 2 }} />
                <Typography variant="h6" fontWeight={700}>{member.name}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>{member.role}</Typography>
                <Stack direction="row" spacing={0.5} justifyContent="center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#bfa26c', fontSize: 18 }} />
                  ))}
                </Stack>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      

      <Container sx={{ py: { xs: 8, md: 12 } }} component={motion.div} variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <SectionTitle
          eyebrow="Achievements"
          title="Awards & Recognitions"
          desc="Honors that celebrate our pursuit of excellence."
        />
        <Grid container spacing={4} justifyContent="center">
          {[1, 2, 3].map((idx) => (
            <Grid key={idx} item xs={12} sm={6} md={4}>
              <MotionBox variants={fadeInUp} sx={{
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
              }}>
                <EmojiEventsIcon sx={{ fontSize: 40, color: '#bfa26c', mb: 1 }} />
                <Typography variant="h6" fontWeight={600} mb={0.5}>
                  Leading Luxury Boutique 2024
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recognized for exceptional guest service and immersive design.
                </Typography>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      

      <Container sx={{ py: { xs: 8, md: 12 } }} component={motion.div} variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <SectionTitle
          eyebrow="Need Help?"
          title="Frequently Asked Questions"
          desc="Everything you might want to know about staying with us."
        />

        <Stack spacing={2}>
          {[
            {
              q: 'Do you offer airport transfers?',
              a: 'Yes, we provide luxury chauffeur-driven airport transfers on request.',
            },
            {
              q: 'Can I host events or meetings at your property?',
              a: 'Absolutely. Our properties include premium event spaces with full support services.',
            },
            {
              q: 'Do you accommodate dietary restrictions?',
              a: 'Our chefs can curate menus around any dietary needs with prior notice.',
            },
          ].map((item, idx) => (
            <MotionBox key={idx} variants={fadeInUp}>
              <Accordion sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            </MotionBox>
          ))}
        </Stack>
      </Container>


      <Divider />

      
    </Box>
  );
};

export default AboutUs;
