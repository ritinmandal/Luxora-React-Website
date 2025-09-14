import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Facebook, Google, LinkedIn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase, createUserProfile } from '../Superbase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

const MotionBox = motion(Box);

const AuthForm = () => {
  const navigate = useNavigate();
  const outerTheme = useTheme();
  const isDark = outerTheme.palette.mode === 'dark';

  const luxoraTheme = useMemo(() => {
    let t = createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: { main: '#c59d5f', contrastText: '#111' },
        secondary: { main: '#0b0f1a' },
        background: {
          default: isDark ? '#0b0f1a' : '#faf7f2',
          paper: isDark ? '#111722' : '#ffffff',
        },
        text: {
          primary: isDark ? '#e6e8ee' : '#1b1f2a',
          secondary: isDark ? '#b7bcc8' : '#5b616e',
        },
      },
      shape: { borderRadius: 10 },
      typography: {
        fontFamily: ['Inter', 'Playfair Display', 'serif'].join(','),
        button: { textTransform: 'none', fontWeight: 700 },
        h4: { fontFamily: 'Playfair Display, serif', fontWeight: 800 },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { borderRadius: 12, paddingInline: 18, paddingBlock: 10 },
            containedPrimary: { backgroundColor: '#c59d5f', '&:hover': { backgroundColor: '#b68b48' } },
            outlinedPrimary: { borderColor: '#c59d5f', color: '#c59d5f', '&:hover': { borderColor: '#b68b48', color: '#b68b48' } },
          },
        },
        MuiTextField: {
          defaultProps: { variant: 'outlined', size: 'medium' },
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 12,
                backgroundColor: isDark ? '#1a2030' : '#fff',
              },
            },
          },
        },
        MuiAlert: { styleOverrides: { root: { borderRadius: 12 } } },
        MuiIconButton: { styleOverrides: { root: { borderRadius: 12 } } },
        MuiPaper: { styleOverrides: { root: { borderRadius: 20 } } },
      },
    });
    return responsiveFontSizes(t);
  }, [isDark]);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [signupStep, setSignupStep] = useState('form');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at && signupStep === 'confirm') {
        await handleProfileCreation(session.user.id);
      }
    };
    checkEmailConfirmation();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at && signupStep === 'confirm') {
        await handleProfileCreation(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, [signupStep]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('info');
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const { data: userProfile, error: userProfileError } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();
        if (userProfile && !userProfileError) {
          setMessage('Please sign up using another email, or contact support.');
          setShowSignupPrompt(true);
        } else {
          setMessage(error.message);
          setShowSignupPrompt(false);
        }
        setMessageType('error');
      } else {
        setMessage('Logged in successfully!');
        navigate('/dashboard');
        setMessageType('success');
        setShowSignupPrompt(false);
      }
    } else {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setMessage(signUpError.message);
        setMessageType('error');
        return;
      }
      const userId = signUpData?.user?.id;
      if (!userId) {
        setMessage('Signup succeeded but user ID not found.');
        setMessageType('error');
        return;
      }
      await handleProfileCreation(userId);
    }
  };

  const handleEmailConfirmation = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email_confirmed_at) {
      await handleProfileCreation(session.user.id);
    } else {
      setMessage('Please confirm your email first. Check your inbox and click the confirmation link.');
      setMessageType('warning');
    }
  };

  const handleProfileCreation = async (userId) => {
    let filePath = null;
    let publicUrl = null;
    if (file) {
      try {
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}.${fileExt}`;
        filePath = `avatars/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        publicUrl = publicData?.publicUrl;
        setMessage('Image uploaded successfully!');
        setMessageType('success');
      } catch (error) {
        setMessage('Image upload failed: ' + error.message);
        setMessageType('error');
        setUploading(false);
      }
    }
    const userDataToInsert = { id: userId, name, phone, email, avatar_url: filePath || '' };
    const { error: insertError } = await createUserProfile(userDataToInsert);
    if (insertError) {
      if (insertError.code === '42501') {
        setMessage('Access denied due to RLS policies. Contact support.');
      } else if (insertError.code === '23505') {
        setMessage('User profile already exists. You can now sign in.');
      } else {
        setMessage('User created but failed to insert profile: ' + insertError.message);
      }
      setMessageType('error');
    } else {
      setSignupStep('complete');
      setMessage('Signup complete! Welcome.');
      setMessageType('success');
    }
    setUploading(false);
  };

  const resetForm = () => {
    setSignupStep('form');
    setMessage('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setFile(null);
  };



  return (
    <ThemeProvider theme={luxoraTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: 1000,
            height: { xs: 'auto', md: 620 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            overflow: 'hidden',
            position: 'relative',
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: 12,
            mt: { xs: 4, md: 10 },
            mb: { xs: 4, md: 10 },
          }}
        >
          <MotionBox
            animate={{ x: isLogin ? '0%' : '-100%' }}
            transition={{ duration: 0.6 }}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: { xs: '100%', md: '50%' },
              height: '100%',
              backgroundImage: `linear-gradient(0deg, rgba(11,15,26,.55), rgba(11,15,26,.55)), url('/pexels-shuvalova-natalia-415991090-15211651.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#fff',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              px: { xs: 3, md: 4 },
              py: { xs: 6, md: 0 },
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" fontWeight="bold" mb={2}>
              {isLogin ? 'Hello, Friend!' : 'Welcome Back!'}
            </Typography>
            <Typography variant="body1" mb={3} sx={{ maxWidth: 380 }}>
              {isLogin
                ? 'Enter your personal details and start your journey with us'
                : 'To keep connected with us please login with your personal info'}
            </Typography>
            <Button
              onClick={() => {
                setIsLogin((prev) => !prev);
                setSignupStep('form');
                setMessage('');
              }}
              variant="outlined"
              color="primary"
            >
              {isLogin ? 'SIGN UP' : 'SIGN IN'}
            </Button>
          </MotionBox>

          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              zIndex: 3,
              transform: { xs: 'translateX(0%)', md: isLogin ? 'translateX(0%)' : 'translateX(100%)' },
              transition: 'transform 0.6s ease-in-out',
              p: { xs: 3, md: 6 },
              bgcolor: 'background.default',
              color: 'text.primary',
            }}
          >
            <Typography variant="h4" fontWeight="bold" mb={2} color="primary.main">
              {isLogin ? 'Sign in' : 'Create Account'}
            </Typography>

            <Box display="flex" gap={1} mb={2}>
              <IconButton color="primary"><Facebook /></IconButton>
              <IconButton color="primary"><Google /></IconButton>
              <IconButton color="primary"><LinkedIn /></IconButton>
            </Box>

            <Typography variant="caption" color="text.secondary">
              or use your {isLogin ? 'account' : 'email for registration'}
            </Typography>

            <Box
             component="form"
  onSubmit={handleAuth}
  mt={2}
  display="flex"
  flexDirection="column"
  gap={2}
  encType="multipart/form-data"
  sx={{
    maxHeight: { xs: '70vh', md: '60vh' }, 
    overflowY: 'auto',
    pr: 1, 
  }}
>
  {message && (
    <Alert severity={messageType} sx={{ mt: 1 }}>
      {message}
      {showSignupPrompt && (
        <Button color="primary" size="small" sx={{ ml: 2 }} onClick={() => setIsLogin(false)}>
          Sign Up
        </Button>
      )}
    </Alert>
  )}

              {signupStep === 'form' && (
                <>
                  {!isLogin && (
                    <>
                      <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <TextField
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ marginTop: '10px' }}
                      />
                    </>
                  )}
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button variant="contained" color="primary" type="submit" sx={{ mt: 1 }} disabled={uploading}>
                    {isLogin ? 'SIGN IN' : uploading ? 'UPLOADING...' : 'SIGN UP'}
                  </Button>

                 
                </>
              )}

              {signupStep === 'confirm' && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" mb={2}>
                    Email Confirmation Required
                  </Typography>
                  <Typography variant="body2" mb={3}>
                    We've sent a confirmation email to {email}. Please check your inbox and click the confirmation link.
                  </Typography>
                  <Button onClick={handleEmailConfirmation} variant="contained" color="primary" disabled={uploading} sx={{ mr: 2 }}>
                    {uploading ? <CircularProgress size={24} color="inherit" /> : "I've Confirmed My Email"}
                  </Button>
                  <Button onClick={resetForm} variant="outlined" color="primary">
                    Start Over
                  </Button>
                </Box>
              )}

              {signupStep === 'complete' && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" mb={2} color="success.main">
                    Welcome to Luxora
                  </Typography>
                  <Typography variant="body2" mb={3}>
                    Your account has been created successfully. You can now log in and access your dashboard.
                  </Typography>
                  <Button
                    onClick={() => {
                      setIsLogin(true);
                      setSignupStep('form');
                      setMessage('');
                    }}
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Sign In
                  </Button>
                  <Button onClick={resetForm} variant="outlined" color="primary">
                    Create Another Account
                  </Button>
                </Box>
              )}

              {isLogin && signupStep === 'form' && (
                <Typography mt={1} fontSize={12} color="text.secondary">
                  Forgot your password?
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AuthForm;
