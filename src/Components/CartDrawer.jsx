import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Button,
  useTheme,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { supabase } from "../Superbase/supabaseClient";
import toast from "react-hot-toast";
import { useCart } from "../Components/CartContext";

const CartDrawer = ({ open, onClose }) => {
    const { cartOpen, closeCart,fetchCartItems } = useCart();

  const [roomCart, setRoomCart] = useState([]);
  const [foodCart, setFoodCart] = useState([]);
  const location = useLocation();
  const pathname = location.pathname;
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const isRoomPage = pathname.includes("/rooms");
  const isDinePage = pathname.includes("/dine");
  const showBoth = pathname === "/cart";
  const navigate = useNavigate();
  const fetchCartData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const { data: rooms } = await supabase.from("Cart").select("*").eq("user_id", userId);
    const { data: foods } = await supabase.from("CartFood").select("*").eq("user_id", userId);

    setRoomCart((rooms || []).map((r) => ({ ...r, nights: r.nights ?? 1 })));
    setFoodCart((foods || []).map((f) => ({ ...f, quantity: f.quantity ?? 1 })));
  };

  useEffect(() => {
    if (open) fetchCartData();
  }, [open]);

  const handleDelete = async (type, id) => {
    const table = type === "room" ? "Cart" : "CartFood";
    await supabase.from(table).delete().eq("id", id);
    toast.success(`${type === "room" ? "Room" : "Food"} removed from cart`);
    fetchCartData();
    fetchCartItems();
  };

  const filteredRooms = isRoomPage || showBoth ? roomCart : [];
  const filteredFoods = isDinePage || showBoth ? foodCart : [];

  const total =
    filteredRooms.reduce((acc, item) => acc + item.price * item.nights, 0) +
    filteredFoods.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const itemBoxStyle = {
    display: "flex",
    alignItems: "center",
    mb: 2,
    p: 1,
    borderRadius: 2,
    backgroundColor: isDark ? "#2c2c2c" : "#f5f5f5",
  };

  return (
    <Drawer anchor="right" open={cartOpen} onClose={closeCart}>
      <Box
        sx={{
          width: 360,
          p: 2,
          height: "100%",
          backgroundColor: isDark ? "#1a1a1a" : "#fff",
          color: isDark ? "#fff" : "inherit",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Your Cart
        </Typography>

        {filteredRooms.length > 0 && (
          <>
            <Typography variant="subtitle1" color="warning.main" mb={1}>
              Room Bookings
            </Typography>
            {filteredRooms.map((room) => (
              <Box key={room.id} sx={itemBoxStyle}>
                <Avatar
                  variant="rounded"
                  src={room.image_url}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box flexGrow={1}>
                  <Typography>{room.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{room.price} × {room.nights} nights
                  </Typography>
                </Box>
                <IconButton onClick={() => handleDelete("room", room.id)}>
                  <Delete color="error" />
                </IconButton>
              </Box>
            ))}
            <Divider sx={{ my: 2, borderColor: isDark ? "#444" : undefined }} />
          </>
        )}

        {filteredFoods.length > 0 && (
          <>
            <Typography variant="subtitle1" color="warning.main" mb={1}>
              Food Orders
            </Typography>
            {filteredFoods.map((food) => (
              <Box key={food.id} sx={itemBoxStyle}>
                <Avatar
                  variant="rounded"
                  src={food.image_url}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box flexGrow={1}>
                  <Typography>{food.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{food.price} × {food.quantity}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleDelete("food", food.id)}>
                  <Delete color="error" />
                </IconButton>
              </Box>
            ))}
          </>
        )}

        {filteredRooms.length === 0 && filteredFoods.length === 0 && (
          <Typography color="text.secondary" mt={3}>
            No items in cart.
          </Typography>
        )}

        {(filteredRooms.length > 0 || filteredFoods.length > 0) && (
          <>
            <Divider sx={{ my: 2, borderColor: isDark ? "#444" : undefined }} />
            <Typography variant="h6" textAlign="right">
              Total: ₹{total}
            </Typography>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Link to="/cart" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={onClose}
                  sx={{
                    
                    borderColor: isDark ? '#eab676' : undefined,
                    color: isDark ? "#eab676" : undefined,
                  }}  
                >
                  View Cart
                </Button>
              </Link>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#bfa26c",
                  color: "#fff",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#a88d59" },
                }}
                onClick={() => {
                  navigate('/cart')
                  onClose();
                }}
              >
                Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
