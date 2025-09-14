import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  CardMedia,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/Slices/Productslice";
import { addToCart } from "../Redux/Slices/RoomCartslice";
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
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const gold = "#bfa26c";

export default function RoomGrid() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const adding = useSelector((state) => state.cart.adding);
  const [ordered, setOrdered] = useState({});
const { openCart, fetchCartItems } = useCart();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

 
  const handleAddToCart = async (product) => {
  const resultAction = await dispatch(addToCart(product));
  if (addToCart.fulfilled.match(resultAction)) {
    setOrdered((prev) => ({ ...prev, [product.id]: true }));
    await fetchCartItems();
    openCart(); 
  }
};


  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 4 },
        overflow: "hidden",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, #0f0f0f 0%, #141414 100%)"
            : "linear-gradient(180deg, #f7f7f7 0%, #ffffff 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: gold,
          opacity: 0.08,
          filter: "blur(120px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -140,
          left: -140,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "#000",
          opacity: 0.05,
          filter: "blur(120px)",
        }}
      />

      <MotionBox
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}
      >
        <MotionTypography
          variants={fadeInUp}
          variant="overline"
          sx={{ letterSpacing: 4, color: gold, fontWeight: 700 }}
        >
          Our Collection
        </MotionTypography>
        <MotionTypography
          variants={fadeInUp}
          variant="h3"
          sx={{
            fontFamily: `'Playfair Display', serif`,
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          Explore Our Luxurious Rooms
        </MotionTypography>
        <MotionTypography
          variants={fadeInUp}
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 760, mx: "auto" }}
        >
          Curated spaces crafted for comfort, character, and a little bit of
          magic.
        </MotionTypography>
      </MotionBox>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        component={motion.div}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {products.map((product, index) => (
          <Grid item key={product.id || index} xs={12} sm={6} md={4} lg={3}>
            <MotionBox
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card
                sx={{
                  height: "100%",
                  width: "400px",
                  borderRadius: 2,
                  overflow: "hidden",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.03)"
                      : "#fff",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  border: (theme) =>
                    theme.palette.mode === "dark"
                      ? `1.5px solid ${gold}`
                      : "none",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={
                      product.image_url?.trim()
                        ? product.image_url
                        : "https://via.placeholder.com/600x400?text=No+Image"
                    }
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: 230,
                      objectFit: "cover",
                      backgroundColor: "white",
                    }}
                  />
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
                      px: 1.8,
                      py: 0.6,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    ₹{product.price} / Night
                  </Box>
                </Box>

                <CardContent
                  sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <Stack spacing={1} mb={2}>
                    <Typography
                      variant="caption"
                      sx={{ color: gold, fontWeight: 600, letterSpacing: 1 }}
                    >
                      Luxury Room
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: `'Playfair Display', serif`,
                        fontWeight: 600,
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description || "1500 SQ.FT / 2 Guests"}
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 2, opacity: 0.2 }} />

                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    mb={2}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} sx={{ fontSize: 18, color: gold }} />
                    ))}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      ml={0.5}
                    >
                      4.9 (200+)
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.5} mt="auto">
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<HotelIcon />}
                      disabled={!!adding[product.id] || ordered[product.id]}
                      onClick={() => handleAddToCart(product)}
                      sx={{
                        bgcolor: ordered[product.id] ? "success" : gold,
                        color: ordered[product.id] ? "white" : "#000",
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1,
                        "&:hover": {
                          bgcolor: ordered[product.id]
                            ? "success.dark"
                            : "#d0b37a",
                        },
                        "&:disabled": {
                          bgcolor: ordered[product.id] ? "success.dark" : gold,
                          color: ordered[product.id] ? "white" : "#000",
                        },
                      }}
                    >
                      {adding[product.id]
                        ? "Adding…"
                        : ordered[product.id]
                        ? "Booked"
                        : "Select Room"}
                    </Button>

                    <Button
                    onClick={() => handleAddToCart(product)}
                      variant="outlined"
                      fullWidth
                      endIcon={<ArrowForwardIosIcon sx={{ fontSize: 15 }} />}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: gold,
                        color: gold,
                        py: 1,
                        "&:hover": {
                          backgroundColor: gold,
                          borderColor: gold,
                          color: "#000",
                        },
                      }}
                    >
                      {ordered[product.id] ? "Add Another" : "View Details"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
