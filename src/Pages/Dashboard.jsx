import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import { supabase, getAvatarUrl } from "../Superbase/supabaseClient";
import HotelIcon from "@mui/icons-material/Hotel";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    avatarUrl: "",
    phone: "",
  });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data: userData } = await supabase
        .from("users")
        .select("name, email, avatar_url, phone")
        .eq("id", userId)
        .single();

      let avatarUrl = "/default-avatar.png";
      if (userData?.avatar_url) {
        try {
          const url = await getAvatarUrl(userData.avatar_url);
          if (url) avatarUrl = url;
        } catch {
          avatarUrl = "/default-avatar.png";
        }
      }

      setUserInfo({
        name: userData?.name || "",
        email: userData?.email || "",
        avatarUrl,
        phone: userData?.phone || "",
      });

      const { data: bookingData, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error) setBookings(bookingData || []);
    };

    fetchUserAndBookings();
  }, []);
  const navigate = useNavigate();
  return (
    <Box mt={10} px={{ xs: 2, md: 6 }} pb={6}>
      <Box textAlign="center" mb={6}>
        <Typography
          sx={{ fontFamily: `'Playfair Display', serif` }}
          variant="h3"
          fontWeight="bold"
          gutterBottom
        >
          My Dashboard
        </Typography>
        <Typography
          sx={{ fontFamily: `'Inter', sans-serif` }}
          variant="h6"
          color="text.secondary"
        >
          Manage your bookings and profile here
        </Typography>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 6,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.75)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            mb: 5,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            alignItems="center"
          >
            <Avatar
              src={userInfo.avatarUrl}
              sx={{
                width: 110,
                height: 110,
                border: "3px solid #e9bd1eff",
                boxShadow: "0 4px 12px rgba(203, 209, 31, 0.2)",
              }}
            />
            <Box>
              <Typography
                sx={{ fontFamily: `'Playfair Display', serif` }}
                variant="h5"
                fontWeight="bold"
                gutterBottom
              >
                Name: {userInfo.name?.toUpperCase()}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Email: {userInfo.email}
              </Typography>
              <Typography color="text.secondary">
                Phone: {userInfo.phone}
              </Typography>
              {userInfo?.email === "ritin@yopmail.com" && (
                <Button
                  variant="contained"
                  
                  
                  onClick={() => navigate("/admin")}
                  sx={{bgcolor:'#c2a76d',mt:2}} 
                >
                  Admin Panel
                </Button>
              )}
            </Box>
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
