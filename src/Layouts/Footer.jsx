import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Container,
  Tooltip,
  InputAdornment,
  Snackbar,
  Alert,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Fab,
  useMediaQuery,
  useTheme,
  Badge,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Pinterest,
  Close,
  ArrowUpward,
  Send,
  Email,
  Place,
  Phone,
  AccessTime,
  VerifiedUser,
  Lock,
  CreditCard,
  Language,
  MonetizationOn,
  Apple,
  Android,
  Launch,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const galleryImages = [
  'https://wallpaperaccess.com/full/902484.jpg',
  'https://wallpaperaccess.com/full/5655394.jpg',
  'https://wallpaperaccess.com/full/5571334.jpg',
  'https://wallpaperaccess.com/full/8183871.jpg',
  'https://wallpaperaccess.com/full/8183878.jpg',
  'https://wallpaperaccess.com/full/8183882.jpg',
];

const accent = '#c59d5f';
const dark = '#0b0f1a';  
const card = '#111722'; 

const Footer = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [email, setEmail] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [lang, setLang] = useState('en');
  const [currency, setCurrency] = useState('INR');
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const gradientBar = useMemo(
    () => `linear-gradient(90deg, ${accent}, #e7c590, ${accent})`,
    []
  );

  const handleSubscribe = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setSnack({ open: true, msg: 'Please enter a valid email address.', severity: 'error' });
      return;
    }
    setSnack({ open: true, msg: 'Subscribed! Welcome to Luxora.', severity: 'success' });
    setEmail('');
  };

  const ListLink = ({ to, children }) => (
    <Typography
      component={Link}
      to={to}
      variant="body2"
      sx={{
        mb: 1,
        color: '#d6d8de',
        textDecoration: 'none',
        display: 'block',
        '&:hover': { color: accent, transform: 'translateX(2px)' },
        transition: 'all .2s ease',
        fontFamily: `'Playfair Display', serif`,
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Box component="footer" sx={{ bgcolor: dark, color: '#fff', pt: 0, pb: 6 }}>
      <Box
        sx={{
          height: { xs: 80, md: 96 },
          background: gradientBar,
          position: 'relative',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              component="img"
              src="/logo-bg1.png"
              alt="Luxora"
              sx={{ height: 40, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,.2))' }}
            />
            <Typography
              variant={isMdUp ? 'h5' : 'subtitle1'}
              sx={{ fontFamily: 'Playfair Display, serif', color: dark, fontWeight: 700 }}
            >
              Indulge in Timeless Luxury
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              to="/reservations"
              variant="contained"
              endIcon={<Launch />}
              sx={{
                bgcolor: dark,
                color: accent,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { bgcolor: '#0a0e18' },
              }}
            >
              Book A Stay
            </Button>
            <Button
              component={Link}
              to="/rooms"
              variant="outlined"
              sx={{
                borderColor: dark,
                color: dark,
                bgcolor: 'rgba(255,255,255,.35)',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,.5)' },
              }}
            >
              Explore Rooms
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          mt: 3,
          position: 'relative',
          zIndex: 1,
          mx: -15,
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                background: `linear-gradient(180deg, rgba(197,157,95,0.06), rgba(197,157,95,0.02))`,
                p: 3,
                marginLeft:15,
                borderRadius: 3,
                border: `1px solid rgba(197,157,95,0.25)`,
                boxShadow: '0 6px 30px rgba(0,0,0,.35)',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', mb: 2 }}
              >
                <Box component="img" src="/logo-bg1.png" alt="Luxora" sx={{ height: 40, mb: 5 }} />
                <Box component="span" sx={{ color: accent, display: 'block', mt: '-50px' }}>
                  Luxora Resorts
                </Box>
                <br />
                <Typography variant="caption" sx={{ color: '#b7bcc8' }}>
                  LUXURY HOTEL
                </Typography>
              </Typography>

              <Divider sx={{ bgcolor: accent, width: 48, mb: 2 }} />

              <Stack spacing={1.2} sx={{ color: '#d6d8de' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Phone fontSize="small" sx={{ color: accent }} />{' '}
                  <Typography variant="body2">+980 (1234) 567 220</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Email fontSize="small" sx={{ color: accent }} />{' '}
                  <Typography variant="body2">example@yahoo.com</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Place fontSize="small" sx={{ color: accent }} />{' '}
                  <Typography variant="body2">102/B New Elephant Rd, Dhaka – 1212</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTime fontSize="small" sx={{ color: accent }} />{' '}
                  <Typography variant="body2">Front Desk: 24/7 • Dining: 7:00–23:00</Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Tooltip title="Facebook">
                  <IconButton sx={{ color: accent, border: '1px solid rgba(197,157,95,.3)' }}>
                    <Facebook />
                  </IconButton>
                </Tooltip>
                <Tooltip title="X / Twitter">
                  <IconButton sx={{ color: accent, border: '1px solid rgba(197,157,95,.3)' }}>
                    <Close />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Instagram">
                  <IconButton sx={{ color: accent, border: '1px solid rgba(197,157,95,.3)' }}>
                    <Instagram />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Pinterest">
                  <IconButton sx={{ color: accent, border: '1px solid rgba(197,157,95,.3)' }}>
                    <Pinterest />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Stack direction="row" spacing={1.2} sx={{ mt: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<VerifiedUser sx={{ color: dark }} />}
                  label="Verified Excellence"
                  sx={{ bgcolor: accent, color: dark, fontWeight: 700 }}
                />
                <Chip
                  icon={<Lock sx={{ color: accent }} />}
                  label="Secure Booking"
                  variant="outlined"
                  sx={{ borderColor: accent, color: '#d6d8de' }}
                />
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display, serif', mb: 2 }}>
              USEFUL LINKS
            </Typography>
            <Divider sx={{ bgcolor: accent, width: 48, mb: 2 }} />

            <ListLink to="/about">About Hotel</ListLink>
            <ListLink to="/rooms">Rooms &amp; Suites</ListLink>
            <ListLink to="/reservations">Reservations</ListLink>
            <ListLink to="/blogs">News &amp; Blogs</ListLink>
            <ListLink to="/dining">Dining</ListLink>
            <ListLink to="/spa">Spa &amp; Wellness</ListLink>
            <ListLink to="/contact">Contact</ListLink>
          </Grid>

          <Grid item xs={12} sm={6} md={3.5}>
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display, serif', mb: 2 }}>
              GALLERY
            </Typography>
            <Divider sx={{ bgcolor: accent, width: 48, mb: 2 }} />
            <Grid container spacing={1}>
              {galleryImages.map((src, index) => (
                <Grid item xs={4} key={index}>
                  <Box
                    component="img"
                    src={src}
                    alt={`gallery-${index}`}
                    loading="lazy"
                    srcSet={`${src} 1x, ${src} 2x`}
                    sx={{
                      width: '100%',
                      height: 72,
                      objectFit: 'cover',
                      borderRadius: 1,
                      transform: 'scale(1)',
                      transition: 'all .25s ease',
                      filter: 'grayscale(18%)',
                      '&:hover': { transform: 'scale(1.04)', filter: 'grayscale(0%)' },
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Stack direction="row" spacing={1.5} sx={{ mt: 2, flexWrap: 'wrap' }}>
              <Button
                startIcon={<Apple />}
                variant="outlined"
                sx={{
                  color: '#d6d8de',
                  borderColor: 'rgba(255,255,255,.2)',
                  textTransform: 'none',
                  '&:hover': { borderColor: accent, color: accent },
                }}
              >
                App Store
              </Button>
              <Button
                startIcon={<Android />}
                variant="outlined"
                sx={{
                  color: '#d6d8de',
                  borderColor: 'rgba(255,255,255,.2)',
                  textTransform: 'none',
                  '&:hover': { borderColor: accent, color: accent },
                }}
              >
                Google Play
              </Button>
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md="auto"
            sx={{
              ml: { md: 'auto' },       
              minWidth: { md: 260 },   
              maxWidth: { md: 300 },
              mb: { xs: 4, md: 2 },
              marginTop:'-280px'
            }}
          >
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display, serif', mb: 1.5 }}>
              NEWSLETTER
            </Typography>
            <Divider sx={{ bgcolor: accent, width: 44, mb: 1.5 }} />
            <Typography variant="body2" sx={{ mb: 1.5, color: '#d6d8de' }}>
              Get offers & updates
            </Typography>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1}
              useFlexGap
              sx={{ mb: 1.25 }}
            >
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    color: '#000',
                    borderRadius: 1,
                    height: 40,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                onClick={handleSubscribe}
                size="small"
                endIcon={<Send />}
                sx={{
                  whiteSpace: 'nowrap',
                  px: 2,
                  height: 40,
                  backgroundColor: accent,
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 1,
                  '&:hover': { backgroundColor: '#b68b48' },
                }}
              >
                Subscribe
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                  <Language fontSize="small" sx={{ color: accent }} />
                  <Typography variant="caption" sx={{ color: '#b7bcc8' }}>
                    Language
                  </Typography>
                </Stack>
                <Select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  sx={{ bgcolor: card, borderRadius: 1, color: '#d6d8de', height: 36 }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">हिन्दी</MenuItem>
                  <MenuItem value="ta">தமிழ்</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                  <MonetizationOn fontSize="small" sx={{ color: accent }} />
                  <Typography variant="caption" sx={{ color: '#b7bcc8' }}>
                    Currency
                  </Typography>
                </Stack>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  sx={{ bgcolor: card, borderRadius: 1, color: '#d6d8de', height: 36 }}
                >
                  <MenuItem value="INR">INR ₹</MenuItem>
                  <MenuItem value="USD">USD $</MenuItem>
                  <MenuItem value="EUR">EUR €</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={0.75} sx={{ mt: 1.25 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CreditCard sx={{ color: accent }} fontSize="small" />
                <Typography variant="body2" sx={{ color: '#d6d8de' }}>
                  Visa • MasterCard • AmEx
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Lock sx={{ color: accent }} fontSize="small" />
                <Typography variant="body2" sx={{ color: '#d6d8de' }}>
                  SSL secured checkout
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Box
        sx={{
          textAlign: 'center',
          mt: 6,
          pt: 3,
          borderTop: '1px solid #1b2230',
          color: '#b7bcc8',
          px: 2,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="caption">© 2025, Luxora. All Rights Reserved.</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                spacing={1.5}
                justifyContent={{ xs: 'center', md: 'flex-end' }}
                sx={{ flexWrap: 'wrap' }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={<Box sx={{ width: 8, height: 8, bgcolor: accent, borderRadius: '50%' }} />}
                >
                  <Chip label="5★ Service" variant="outlined" sx={{ borderColor: accent, color: '#d6d8de' }} />
                </Badge>
                <Chip label="Eco-Friendly" variant="outlined" sx={{ borderColor: accent, color: '#d6d8de' }} />
                <Chip label="Contactless Check-in" variant="outlined" sx={{ borderColor: accent, color: '#d6d8de' }} />
                <Chip label="Free Wi-Fi" variant="outlined" sx={{ borderColor: accent, color: '#d6d8de' }} />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      
      <Fab
        aria-label="scroll to top"
        size="medium"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          bgcolor: accent,
          color: '#111',
          display: showTop ? 'flex' : 'none',
          '&:hover': { bgcolor: '#b68b48' },
        }}
      >
        <ArrowUpward />
      </Fab>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer;
