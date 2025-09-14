import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Button,
  Divider,
  Skeleton,
} from "@mui/material";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion";
import { supabase } from "../Superbase/supabaseClient";
import toast from "react-hot-toast";
import { useCart } from "../Components/CartContext";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const gold = "#bfa26c";

export default function DiningPagePremium() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [orderedDishIds, setOrderedDishIds] = useState([]);
  const { openCart, fetchCartItems } = useCart();

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .order("name");
      if (error) throw error;
      setDishes(data || []);
    } catch (e) {
      console.error("Error fetching dishes:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (str) => (str || "").trim().toLowerCase();

  const cuisines = useMemo(() => {
    const set = new Set(
      dishes.map((d) => normalize(d.cuisine)).filter(Boolean)
    );
    return ["All", ...Array.from(set).sort()];
  }, [dishes]);

  const filtered = useMemo(() => {
    if (normalize(activeCuisine) === "all") return dishes;
    return dishes.filter(
      (d) => normalize(d.cuisine) === normalize(activeCuisine)
    );
  }, [dishes, activeCuisine]);

  const handleAddToCart = async (dish) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Please log in to add items to your cart.");
        return;
      }

      const { error } = await supabase.from("CartFood").insert({
        user_id: user.id,
        name: dish.name,
        price: dish.price,
        cuisine: dish.cuisine,
        quantity: 1,
        image_url: dish.image_url,
      });

      if (error) throw error;

      setOrderedDishIds((prev) => [...prev, dish.id]);

      toast.success("Item added to cart!", {
        style: {
          border: "1px solid #c2a15f",
          padding: "16px",
          color: "#4c4c4c",
        },
        iconTheme: { primary: "#c2a15f", secondary: "#ffffff" },
      });

      await fetchCartItems();
      openCart();
    } catch (err) {
      console.error("Add to cart failed:", err.message);
      toast.error("Failed to add item to cart.");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: (t) =>
          t.palette.mode === "dark" ? "#0f0f0f" : "#f7f7f7",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: { xs: "60vh", md: "75vh" },
          backgroundImage: `url('https://images.pexels.com/photos/5591660/pexels-photo-5591660.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <MotionTypography
              variant="overline"
              initial="hidden"
              animate="show"
              transition={{ delay: 0.15 }}
              sx={{ letterSpacing: 4, color: gold, fontWeight: 700 }}
            >
              THE DINING EXPERIENCE
            </MotionTypography>
            <MotionTypography
              variant="h2"
              initial="hidden"
              animate="show"
              transition={{ delay: 0.25 }}
              sx={{
                fontFamily: `'Playfair Display', serif`,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.1,
                maxWidth: 900,
              }}
            >
              Curated Cuisines, Crafted With Soul
            </MotionTypography>
            <MotionTypography
              variant="body1"
              initial="hidden"
              animate="show"
              transition={{ delay: 0.35 }}
              sx={{ color: "rgba(255,255,255,0.8)", maxWidth: 760 }}
            >
              Powered directly by your Supabase data – Indian, Chinese, Italian
              & more.
            </MotionTypography>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <MotionBox
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <MotionTypography
            variants={fadeInUp}
            variant="h4"
            sx={{
              fontFamily: `'Playfair Display', serif`,
              fontWeight: 700,
              textAlign: "center",
              mb: 1.5,
            }}
          >
            Explore By Cuisine
          </MotionTypography>

          <MotionTypography
            variants={fadeInUp}
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 4 }}
          >
            {loading
              ? "Loading cuisines…"
              : `${filtered.length} dish${filtered.length !== 1 ? "es" : ""} ${
                  activeCuisine === "All" ? "available" : `in ${activeCuisine}`
                }`}
          </MotionTypography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            flexWrap="wrap"
            sx={{ mb: { xs: 4, md: 6 } }}
          >
            <Chip
              icon={<FilterListIcon />}
              label="Filter"
              sx={{ borderColor: gold, color: gold }}
              variant="outlined"
            />
            {cuisines.map((c) => (
              <Chip
                key={c}
                label={c.charAt(0).toUpperCase() + c.slice(1)}
                onClick={() => setActiveCuisine(c)}
                color={
                  activeCuisine.toLowerCase() === c ? "warning" : "default"
                }
                sx={{
                  borderRadius: 999,
                  px: 1.5,
                  borderColor: gold,
                  color: activeCuisine.toLowerCase() === c ? "#000" : gold,
                  backgroundColor:
                    activeCuisine.toLowerCase() === c ? gold : "transparent",
                  "&:hover": {
                    borderColor: gold,
                    backgroundColor:
                      activeCuisine.toLowerCase() === c
                        ? gold
                        : "rgba(191,162,108,0.08)",
                  },
                }}
                variant="outlined"
              />
            ))}
          </Stack>

          <Grid
            container
            spacing={4}
            component={motion.div}
            variants={staggerContainer}
            whileInView="show"
            viewport={{ once: false, amount: 0.15 }}
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        width: "250px",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={220}
                      />
                      <Box p={2}>
                        <Skeleton width="60%" height={28} />
                        <Skeleton width="80%" height={18} />
                        <Skeleton width="40%" height={18} />
                      </Box>
                    </Card>
                  </Grid>
                ))
              : filtered.map((dish) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
                    <MotionBox
                      variants={fadeInUp}
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Card
                        sx={{
                          width: "350px",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 4,
                          overflow: "hidden",
                          background: (t) =>
                            t.palette.mode === "dark"
                              ? "rgba(255,255,255,0.03)"
                              : "#fff",
                          boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
                          border: (t) =>
                            t.palette.mode === "dark"
                              ? `1px solid ${gold}`
                              : "none",
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            image={dish.image_url?.trim()}
                            alt={dish.name}
                            sx={{
                              width: "100%",
                              height: 220,
                              objectFit: "cover",
                              backgroundColor: "white",
                            }}
                          />
                          {dish.is_veg && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 16,
                                left: 16,
                                backgroundColor: "rgba(255,255,255,0.9)",
                                color: "green",
                                fontSize: 12,
                                fontWeight: 700,
                                borderRadius: 999,
                                px: 1,
                                py: 0.2,
                              }}
                            >
                              VEG
                            </Box>
                          )}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 16,
                              right: 16,
                              backgroundColor: gold,
                              color: "#000",
                              fontSize: 14,
                              fontWeight: 700,
                              borderRadius: 999,
                              px: 1.5,
                              py: 0.4,
                              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            }}
                          >
                            ₹{dish.price}
                          </Box>
                        </Box>

                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          }}
                        >
                          <Stack spacing={0.75} mb={1.5}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: gold,
                                fontWeight: 600,
                                letterSpacing: 1,
                              }}
                            >
                              {dish.cuisine || "Cuisine"}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: `'Playfair Display', serif`,
                                fontWeight: 600,
                              }}
                            >
                              {dish.name}
                            </Typography>
                            {dish.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                              >
                                {dish.description}
                              </Typography>
                            )}
                          </Stack>

                          <Divider sx={{ my: 1.5, opacity: 0.15 }} />

                          <Stack direction="row" spacing={1.5} mt="auto">
                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={<LocalDiningIcon />}
                              onClick={() => handleAddToCart(dish)}
                              disabled={orderedDishIds.includes(dish.id)}
                              sx={{
                                bgcolor: orderedDishIds.includes(dish.id)
                                  ? "#2e7d32"
                                  : gold,
                                color: orderedDishIds.includes(dish.id)
                                  ? "#fff"
                                  : "#000",
                                borderRadius: 999,
                                textTransform: "none",
                                fontWeight: 600,
                                py: 1,
                                minHeight: 44,
                                "&:hover": {
                                  bgcolor: orderedDishIds.includes(dish.id)
                                    ? "#1b5e20"
                                    : "#d0b37a",
                                },
                                "&.Mui-disabled": {
                                  bgcolor: orderedDishIds.includes(dish.id)
                                    ? "#2e7d32"
                                    : gold,
                                  color: orderedDishIds.includes(dish.id)
                                    ? "#fff"
                                    : "#000",
                                  opacity: 1,
                                },
                              }}
                            >
                              {orderedDishIds.includes(dish.id)
                                ? "Ordered"
                                : "Add to Order"}
                            </Button>

                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() =>
                                orderedDishIds.includes(dish.id) &&
                                handleAddToCart(dish)
                              }
                              endIcon={
                                <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                              }
                              sx={{
                                borderRadius: 999,
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: gold,
                                color: orderedDishIds.includes(dish.id)
                                  ? gold
                                  : gold,
                                py: 1,
                                minHeight: 44,
                                "&:hover": {
                                  backgroundColor: orderedDishIds.includes(
                                    dish.id
                                  )
                                    ? gold
                                    : gold,
                                  borderColor: gold,
                                  color: "#000",
                                },
                              }}
                            >
                              {orderedDishIds.includes(dish.id)
                                ? "Add Another"
                                : "View Details"}
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </MotionBox>
                  </Grid>
                ))}
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
}
