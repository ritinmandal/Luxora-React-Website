import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, getAvatarUrl } from '../Superbase/supabaseClient';
import CartDrawer from '../Components/CartDrawer';
import { useCart } from '../Components/CartContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'Dine', path: '/dine' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

const Header = ({ toggleDarkMode, darkMode }) => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userData, setUserData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    cartOpen,
    openCart,
    closeCart,
    cartCount,
    fetchCartItems,
  } = useCart();

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        setAvatarUrl('/default-avatar.png');
        return;
      }

      setUserData(data);
      if (data.avatar_url) {
        try {
          const url = await getAvatarUrl(data.avatar_url);
          setAvatarUrl(url || '/default-avatar.png');
        } catch {
          setAvatarUrl('/default-avatar.png');
        }
      } else {
        setAvatarUrl('/default-avatar.png');
      }
    };

    if (user) fetchUserData();
  }, [user]);

  useEffect(() => {
    if (user) fetchCartItems(); 
  }, [user]);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    handleClose();
    navigate('/');
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(6px)',
          px: 2,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            <span style={{ fontFamily: 'serif', fontSize: '24px' }}>LUXORA</span>
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3, fontFamily: `'Playfair Display', serif` }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{ color: 'white', fontWeight: 500 }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {user ? (
              <>
                <IconButton color="inherit" onClick={openCart}>
                  <Badge badgeContent={cartCount} color="error" showZero>
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <IconButton onClick={handleMenu}>
                  <Avatar src={avatarUrl || '/default-avatar.png'} alt="Profile" />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem component={Link} to="/dashboard" onClick={handleClose}>Dashboard</MenuItem>
                  <MenuItem component={Link} to="/cart" onClick={handleClose}>My Cart</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} to="/signup" sx={{ color: 'white' }}>
                Sign In
              </Button>
            )}

            {isMobile && (
              <IconButton color="inherit" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box
          sx={{ width: 250, p: 2, backgroundColor: theme.palette.background.default }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <List>
            {navLinks.map((link) => (
              <ListItem
                button
                key={link.label}
                component={Link}
                to={link.path}
                sx={{ fontFamily: `'Playfair Display', serif` }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    sx: {
                      color: '#eab676',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </>
  );
};

export default Header;
