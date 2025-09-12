import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../Superbase/supabaseClient';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  Rating,
  Divider,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Skeleton,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const gold = '#c59d5f';

const variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Blogs = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const bootstrap = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('name, avatar_url')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    bootstrap();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blogs')
      .select('id, title, content, created_at, user_id, author_name, image_url')
      .order('created_at', { ascending: false });

    const enriched = await Promise.all(
      (data || []).map(async (blog) => {
        const { data: userData } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', blog.user_id)
          .single();
        return { ...blog, avatar_url: userData?.avatar_url || '' };
      })
    );
    setBlogs(enriched);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !user?.id) return;
    const { error } = await supabase.from('blogs').insert([
      {
        title: title.trim(),
        content: content.trim(),
        user_id: user.id,
        author_name: profile?.name || user.email,
        image_url: profile?.avatar_url || '',
      },
    ]);
    if (!error) {
      setTitle('');
      setContent('');
      fetchBlogs();
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.author_name?.toLowerCase().includes(q) ||
        b.content?.toLowerCase().includes(q)
    );
  }, [blogs, query]);

  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(1200px 500px at 10% -10%, rgba(197,157,95,.15), transparent 60%), radial-gradient(1000px 600px at 110% 0%, rgba(197,157,95,.08), transparent 60%), #0b0f1a'
          : 'linear-gradient(180deg, #faf7f2 0%, #ffffff 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: isDark ? 'brightness(.35) blur(2px)' : 'brightness(.6) blur(3px)',
          zIndex: -2,
          opacity: isDark ? 0.35 : 0.25,
        }}
      />
      <MotionBox
        variants={variants}
        initial="hidden"
        animate="show"
        sx={{ textAlign: 'center', mb: 5 }}
      >
        <Typography
          variant="overline"
          sx={{ color: gold, letterSpacing: 4, fontWeight: 800 }}
        >
          LUXURY HOTEL & RESORT
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: isDark ? '#fff' : '#1b1f2a',
            fontWeight: 800,
            textShadow: isDark ? '0 2px 16px rgba(0,0,0,.5)' : 'none',
            fontFamily: `'Playfair Display', serif`,
          }}
        >
          Client Testimonials & Feedback
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: isDark ? '#b7bcc8' : '#5b616e', mt: 1.2, maxWidth: 760, mx: 'auto' }}
        >
          Stories from guests who discovered comfort, character, and a touch of magic.
        </Typography>
      </MotionBox>

      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto', mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={isDark ? 0 : 3}
            sx={{
              p: 3,
              borderRadius: 3,
              background: isDark
                ? 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))'
                : '#ffffff',
              border: isDark ? '1px solid rgba(197,157,95,.25)' : '1px solid #efe6d6',
              boxShadow: isDark ? '0 20px 50px rgba(0,0,0,.35)' : '0 10px 30px rgba(0,0,0,.06)',
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                fullWidth
                placeholder="Search by title, author, or message"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: isDark ? '#b7bcc8' : '#7a7f8a' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Chip
                label={`${filtered.length} ${filtered.length === 1 ? 'entry' : 'entries'}`}
                sx={{
                  borderColor: gold,
                  color: isDark ? gold : '#7a6538',
                  borderWidth: 1,
                }}
                variant="outlined"
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {user ? (
            <Paper
              elevation={isDark ? 0 : 3}
              sx={{
                width:'140%',
                p: 3,
                borderRadius: 3,
                background: isDark
                  ? 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))'
                  : '#ffffff',
                border: isDark ? '1px solid rgba(197,157,95,.25)' : '1px solid #f4c574ff',
                boxShadow: isDark ? '0 20px 50px rgba(0,0,0,.35)' : '0 10px 30px rgba(0,0,0,.06)',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar src={profile?.avatar_url} sx={{ width: 48, height: 48 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: isDark ? '#fff' : '#1b1f2a' }}>
                    {profile?.name || 'Guest'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#b7bcc8' : '#7a7f8a' }}>
                    Share your experience
                  </Typography>
                </Box>
              </Stack>

              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Your Feedback"
                fullWidth
                multiline
                minRows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: gold,
                  color: '#111',
                  fontWeight: 800,
                  '&:hover': { backgroundColor: '#b68b48' },
                }}
                disabled={!title.trim() || !content.trim()}
              >
                Post
              </Button>
            </Paper>
          ) : (
            <Paper
              elevation={isDark ? 0 : 3}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                background: isDark
                  ? 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))'
                  : '#ffffff',
                border: isDark ? '1px solid rgba(197,157,95,.25)' : '1px solid #efe6d6',
                boxShadow: isDark ? '0 20px 50px rgba(0,0,0,.35)' : '0 10px 30px rgba(0,0,0,.06)',
              }}
            >
              <Typography sx={{ mb: 1, fontWeight: 700, color: isDark ? '#fff' : '#1b1f2a' }}>
                Join the conversation
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: isDark ? '#b7bcc8' : '#5b616e' }}>
                Sign in to write a testimonial and inspire future guests.
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: gold, color: '#111', fontWeight: 800, '&:hover': { backgroundColor: '#b68b48' } }}
                href="/auth"
              >
                Sign In
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={`sk-${i}`}>
                <Paper
                  sx={{
                    p: 0,
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: isDark ? 'rgba(255,255,255,.04)' : '#fff',
                  }}
                >
                  <Skeleton variant="rectangular" height={180} />
                  <Box sx={{ p: 2 }}>
                    <Skeleton width="60%" />
                    <Skeleton width="90%" />
                    <Skeleton width="80%" />
                    <Skeleton width="40%" />
                  </Box>
                </Paper>
              </Grid>
            ))
          : filtered.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <MotionCard
                  variants={variants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: isDark
                      ? 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))'
                      : '#ffffff',
                    border: isDark ? '1px solid rgba(197,157,95,.25)' : '1px solid #efe6d6',
                    boxShadow: isDark ? '0 20px 50px rgba(0,0,0,.35)' : '0 12px 28px rgba(0,0,0,.06)',
                  }}
                >
                  <CardMedia
                   
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Avatar src={blog.avatar_url} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, lineHeight: 1, color: isDark ? '#fff' : '#1b1f2a' }}>
                          {blog.author_name || 'Guest'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#b7bcc8' : '#7a7f8a' }}>
                          {fmt(blog.created_at)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: `'Playfair Display', serif`,
                        fontWeight: 700,
                        color: isDark ? '#fff' : '#1b1f2a',
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {blog.title || 'Guest Experience'}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 60,
                      }}
                    >
                      {blog.content}
                    </Typography>

                    <Divider sx={{ my: 1.5, opacity: isDark ? 0.2 : 0.4 }} />

                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 'auto' }}>
                      <Rating value={5} readOnly size="small" sx={{ color: gold }} />
                      <Box flex={1} />
                      <Button
                        size="small"
                        onClick={() => setDialog(blog)}
                        sx={{
                          color: isDark ? gold : '#7a6538',
                          fontWeight: 700,
                          textTransform: 'none',
                          '&:hover': { color: gold },
                        }}
                      >
                        Read more
                      </Button>
                    </Stack>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
      </Grid>

      <Dialog open={Boolean(dialog)} onClose={() => setDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 6 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar src={dialog?.avatar_url} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography sx={{ fontWeight: 700 }}>{dialog?.author_name}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {dialog ? fmt(dialog.created_at) : ''}
              </Typography>
            </Box>
            <Box flex={1} />
            <IconButton onClick={() => setDialog(null)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" sx={{ fontFamily: `'Playfair Display', serif`, fontWeight: 700, mb: 1 }}>
            {dialog?.title}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {dialog?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)} sx={{ color: gold, fontWeight: 700, textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Blogs;
