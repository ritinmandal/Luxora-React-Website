import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import WifiIcon from "@mui/icons-material/Wifi";
import HotelIcon from "@mui/icons-material/Hotel";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PoolIcon from "@mui/icons-material/Pool";
import SpaIcon from "@mui/icons-material/Spa";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

import bgLogo from "../../public/logo-bg1.png";
import title from "../../public/logo-bg1.png";

const facilities = [
  {
    label: "Room Services",
    icon: <HotelIcon sx={{ fontSize: 50, color: "#d4af37" }} />,
    image:
      "https://wp.ditsolution.net/royella-multipurpose/wp-content/uploads/2024/06/feature-imgs-1.jpg",
  },
  {
    label: "Wi-Fi Internet",
    icon: <WifiIcon sx={{ fontSize: 50, color: "#d4af37" }} />,
    image:
      "https://thumbs.dreamstime.com/b/golden-wifi-vector-icon-gold-wi-fi-wireless-sign-isolated-logo-transparent-background-166521960.jpg",
  },
  {
    label: "Dining",
    icon: <RestaurantMenuIcon sx={{ fontSize: 50, color: "#d4af37" }} />,
    image: "https://mirt.ua/uploads/content/5d2c859b80adc6.03175939.jpg",
  },
  {
    label: "Luxury Spa",
    icon: <SpaIcon sx={{ fontSize: 50, color: "#d4af37" }} />,
    image:
      "https://i.pinimg.com/736x/be/d4/63/bed463bd13077edd554d194263093b2c.jpg",
  },
  {
    label: "Swimming Pool",
    icon: <PoolIcon sx={{ fontSize: 50, color: "#d4af37" }} />,
    image:
      "https://images.pexels.com/photos/12387865/pexels-photo-12387865.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=750&w=1260",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const FacilitiesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Box
      sx={{
        backgroundColor: "#1b1b1b",
        color: "#fff",
        py: 10,
        position: "relative",
        overflow: "hidden",
        fontFamily: `'Playfair Display', serif`,
      }}
    >
      <Box
        component="img"
        src={bgLogo}
        alt="Logo"
        sx={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          opacity: 0.07,
          zIndex: 0,
          fontFamily: `'Playfair Display', serif`,
        }}
      />

      <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <Box
          component="img"
          src={title}
          alt="Icon"
          sx={{
            width: 60,
            height: 60,
            mb: 2,
            display: "inline-block",
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontFamily: `'Playfair Display', serif`,
          }}
        >
          HOTEL’S FACILITIES
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#ccc",
            maxWidth: 600,
            mx: "auto",
            fontFamily: `'Playfair Display', serif`,

            mb: 6,
            fontSize: "15px",
          }}
        >
          Proactively morph optimal infomediaries rather than accurate
          expertise. Intrinsically progressive resources rather than
          resource-leveling
        </Typography>
      </Box>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ position: "relative", zIndex: 2 }}
      >
        {facilities.map((facility, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <motion.div
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={cardVariants}
            >
              <Card
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  backgroundColor: "transparent",
                  fontFamily: `'Playfair Display', serif`,

                  border: "1px solid #333",
                  borderRadius: 2,
                  p: 3,
                  mb: 10,
                  cursor: "pointer",
                  overflow: "hidden",
                  textAlign: "center",
                  height: 220,
                  width: 250,
                  position: "relative",
                  transition: "all 0.3s ease",
                  transform:
                    hoveredIndex === index
                      ? "translateY(-10px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredIndex === index
                      ? "0 0 20px 4px rgba(212, 175, 55, 0.4)"
                      : "none",
                }}
                elevation={0}
              >
                <CardContent
                  sx={{
                    p: 0,
                    height: "100%",
                    position: "relative",
                  }}
                >
                  {hoveredIndex === index ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 1,
                        overflow: "hidden",
                        position: "relative",
                        zIndex: 1,
                        fontFamily: `'Playfair Display', serif`,
                      }}
                    >
                      <motion.img
                        src={facility.image}
                        alt={facility.label}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2 }}>{facility.icon}</Box>
                  )}

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: `'Playfair Display', serif`,

                      color: "#fff",
                      fontWeight: 500,
                      mt: hoveredIndex === index ? 1 : 3,
                      zIndex: 2,
                      position: "relative",
                    }}
                  >
                    {facility.label}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FacilitiesSection;
