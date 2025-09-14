import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Button,
  useTheme,
  TableContainer,
  Divider,
  Chip,
  TextField,
  Stack,
  Tooltip,
  LinearProgress,
  Card,
  CardContent,
  CardHeader,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { Add, Remove, Delete, LocalOffer, ShoppingCartCheckout } from "@mui/icons-material";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Superbase/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import CartBanner from "../Components/CartBanner";

const ACCENT = "#bfa26c";
const ACCENT_HOVER = "#a88d59";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

const TAX_RATE = 0.12; 
const SERVICE_FEE = 199; 

const MyCart = () => {
  const [roomCart, setRoomCart] = useState([]);
  const [foodCart, setFoodCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const headerSx = { background: isDark ? "#181818" : "#111", position: "sticky", top: 0, zIndex: 1 };
  const thSx = { color: ACCENT, fontWeight: 700 };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const userId = userData?.user?.id;
      if (!userId) {
        setRoomCart([]);
        setFoodCart([]);
        setLoading(false);
        return;
      }

      const [{ data: rooms = [] }, { data: foods = [] }] = await Promise.all([
        supabase.from("Cart").select("*").eq("user_id", userId),
        supabase.from("CartFood").select("*").eq("user_id", userId),
      ]);

      setRoomCart(rooms.map((r) => ({ ...r, nights: r.nights ?? 1 })));
      setFoodCart(foods.map((f) => ({ ...f, quantity: f.quantity ?? 1 })));
    } catch (e) {
      toast.error("Couldn't load your cart.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const persistQuantity = async (type, id, key, value) => {
    try {
      const table = type === "room" ? "Cart" : "CartFood";
      const { error } = await supabase.from(table).update({ [key]: value }).eq("id", id);
      if (error) throw error;
    } catch (e) {
      toast.error("Update failed. Please try again.");
      console.error(e);
    }
  };

  const handleQuantityChange = (type, id, operation) => {
    if (type === "room") {
      setRoomCart((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const next = Math.max(1, (item.nights || 1) + (operation === "inc" ? 1 : -1));
          persistQuantity("room", id, "nights", next);
          return { ...item, nights: next };
        })
      );
    } else {
      setFoodCart((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const next = Math.max(1, (item.quantity || 1) + (operation === "inc" ? 1 : -1));
          persistQuantity("food", id, "quantity", next);
          return { ...item, quantity: next };
        })
      );
    }
  };

  const handleDelete = async (type, id) => {
    try {
      const table = type === "room" ? "Cart" : "CartFood";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      toast.success(`${type === "room" ? "Room" : "Food"} removed`);
      if (type === "room") setRoomCart((p) => p.filter((i) => i.id !== id));
      else setFoodCart((p) => p.filter((i) => i.id !== id));
    } catch (error) {
      toast.error("Error removing item");
      console.error(error);
    }
  };

  const roomTotal = useMemo(
    () => roomCart.reduce((acc, item) => acc + (item.price || 0) * (item.nights || 1), 0),
    [roomCart]
  );
  const foodTotal = useMemo(
    () => foodCart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0),
    [foodCart]
  );
  const baseTotal = roomTotal + foodTotal;

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    // simple demo rules; adapt to your backend rules
    if (appliedPromo === "WELCOME10") return Math.floor(baseTotal * 0.1);
    if (appliedPromo === "FOOD50" && foodTotal >= 999) return 50;
    return 0;
  }, [appliedPromo, baseTotal, foodTotal]);

  const taxable = Math.max(0, baseTotal - discount);
  const taxes = Math.floor(taxable * TAX_RATE);
  const payable = Math.max(0, taxable + taxes + (baseTotal > 0 ? SERVICE_FEE : 0));

  const applyPromo = () => {
    const code = (promo || "").trim().toUpperCase();
    if (!code) return;
    if (["WELCOME10", "FOOD50"].includes(code)) {
      setAppliedPromo(code);
      toast.success(`Applied ${code}`);
    } else {
      setAppliedPromo(null);
      toast.error("Invalid code");
    }
  };

  const handlePayment = async () => {
    if (roomCart.length === 0 && foodCart.length === 0) {
      toast.error("Please add at least one room or food item.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return toast.error("Login required");

    const bookingId = uuidv4();
    const orderDetails = {
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email,
      userImage: user.user_metadata?.avatar_url,
      rooms: roomCart,
      foods: foodCart,
      roomTotal,
      foodTotal,
      baseTotal,
      discount,
      taxes,
      serviceFee: SERVICE_FEE,
      total: payable,
      promo: appliedPromo,
      bookingId,
    };

    try {
      await Promise.all([
        supabase.from("Cart").delete().eq("user_id", user.id),
        supabase.from("CartFood").delete().eq("user_id", user.id),
      ]);
      navigate("/payment_gateway", { state: orderDetails });
    } catch (e) {
      toast.error("Checkout failed. Try again.");
      console.error(e);
    }
  };

  const SectionTitle = ({ children }) => (
    <Typography variant="h6" fontWeight={800} sx={{ color: ACCENT, mb: 1, letterSpacing: 0.3 }}>
      {children}
    </Typography>
  );

  const EmptyState = ({ title, ctaText, to }) => (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        textAlign: "center",
        borderColor: isDark ? "#2b2b2b" : "#e7e7e7",
        bgcolor: isDark ? "#121212" : "#fafafa",
      }}
    >
      <Typography sx={{ mb: 1.5, opacity: 0.8 }}>{title}</Typography>
      <Button
        component={Link}
        to={to}
        variant="contained"
        sx={{ backgroundColor: ACCENT, "&:hover": { backgroundColor: ACCENT_HOVER }, textTransform: "none", fontWeight: 700 }}
      >
        {ctaText}
      </Button>
    </Paper>
  );

  const MobileRoomItem = ({ room }) => (
    <Paper sx={{ p: 2, mb: 1.5, borderRadius: 2 }} variant="outlined">
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar variant="rounded" src={room.image_url} alt={room.name} sx={{ width: 76, height: 66 }} />
        <Box flex={1}>
          <Typography fontWeight={700}>{room.name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>{room.type}</Typography>
          <Typography fontWeight={700} sx={{ mt: 0.5 }}>{currency(room.price)} / night</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Tooltip title="Decrease nights">
              <IconButton size="small" onClick={() => handleQuantityChange("room", room.id, "dec")}><Remove /></IconButton>
            </Tooltip>
            <Chip label={`${room.nights} night${room.nights > 1 ? "s" : ""}`} size="small" />
            <Tooltip title="Increase nights">
              <IconButton size="small" onClick={() => handleQuantityChange("room", room.id, "inc")}><Add /></IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Stack alignItems="flex-end" spacing={1}>
          <Typography fontWeight={800}>{currency(room.price * room.nights)}</Typography>
          <IconButton onClick={() => handleDelete("room", room.id)}><Delete sx={{ color: "red" }} /></IconButton>
        </Stack>
      </Stack>
    </Paper>
  );

  const MobileFoodItem = ({ food }) => (
    <Paper sx={{ p: 2, mb: 1.5, borderRadius: 2 }} variant="outlined">
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar variant="rounded" src={food.image_url} alt={food.name} sx={{ width: 76, height: 66 }} />
        <Box flex={1}>
          <Typography fontWeight={700}>{food.name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>{food.cuisine}</Typography>
          <Typography fontWeight={700} sx={{ mt: 0.5 }}>{currency(food.price)}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Tooltip title="Decrease quantity">
              <IconButton size="small" onClick={() => handleQuantityChange("food", food.id, "dec")}><Remove /></IconButton>
            </Tooltip>
            <Chip label={`${food.quantity}`} size="small" />
            <Tooltip title="Increase quantity">
              <IconButton size="small" onClick={() => handleQuantityChange("food", food.id, "inc")}><Add /></IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Stack alignItems="flex-end" spacing={1}>
          <Typography fontWeight={800}>{currency(food.price * food.quantity)}</Typography>
          <IconButton onClick={() => handleDelete("food", food.id)}><Delete sx={{ color: "red" }} /></IconButton>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <>
      <CartBanner />

      {loading && <LinearProgress sx={{ height: 3 }} />}

      <Box sx={{ p: { xs: 2, md: 4 }, pb: 6 }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} lg={8}>
            <SectionTitle>Room Bookings</SectionTitle>
            {roomCart.length === 0 ? (
              <EmptyState title="No rooms in your cart yet." ctaText="Browse Rooms" to="/rooms" />
            ) : isMobile ? (
              <Box>
                {roomCart.map((room) => <MobileRoomItem key={room.id} room={room} />)}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, my: 2 }}>
                  <Button component={Link} to="/rooms" variant="contained"
                    sx={{ backgroundColor: ACCENT, color: "#fff", "&:hover": { backgroundColor: ACCENT_HOVER }, textTransform: "none", fontWeight: "bold" }}>
                    Add More Rooms
                  </Button>
                </Box>
              </Box>
            ) : (
              <Paper elevation={3} sx={{ mb: 2, overflow: "hidden", borderRadius: 2 }}>
                <TableContainer>
                  <Table size="medium">
                    <TableHead sx={headerSx}>
                      <TableRow>
                        <TableCell sx={thSx}>Image</TableCell>
                        <TableCell sx={thSx}>Room</TableCell>
                        <TableCell sx={thSx}>Type</TableCell>
                        <TableCell sx={thSx} align="right">Price</TableCell>
                        <TableCell sx={thSx} align="center">Nights</TableCell>
                        <TableCell sx={thSx} align="right">Subtotal</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roomCart.map((room) => (
                        <TableRow key={room.id} hover>
                          <TableCell>
                            <Avatar variant="rounded" src={room.image_url} alt={room.name} sx={{ width: 76, height: 66 }} />
                          </TableCell>
                          <TableCell>{room.name}</TableCell>
                          <TableCell>{room.type}</TableCell>
                          <TableCell align="right">{currency(room.price)}</TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleQuantityChange("room", room.id, "dec")}><Remove /></IconButton>
                            <Chip label={room.nights} size="small" />
                            <IconButton onClick={() => handleQuantityChange("room", room.id, "inc")}><Add /></IconButton>
                          </TableCell>
                          <TableCell align="right">{currency(room.price * room.nights)}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleDelete("room", room.id)}><Delete sx={{ color: "red" }} /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
                  <Button component={Link} to="/rooms" variant="contained"
                    sx={{ backgroundColor: ACCENT, color: "#ffffff", "&:hover": { backgroundColor: ACCENT_HOVER }, textTransform: "none", fontWeight: "bold" }}>
                    Add More Rooms
                  </Button>
                </Box>
              </Paper>
            )}

          
            <SectionTitle>Food Orders</SectionTitle>
            {foodCart.length === 0 ? (
              <EmptyState title="No food items yet." ctaText="Explore Menu" to="/dine" />
            ) : isMobile ? (
              <Box>
                {foodCart.map((food) => <MobileFoodItem key={food.id} food={food} />)}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, my: 2 }}>
                  <Button component={Link} to="/dine" variant="contained"
                    sx={{ backgroundColor: ACCENT, color: "#fff", "&:hover": { backgroundColor: ACCENT_HOVER }, textTransform: "none", fontWeight: "bold" }}>
                    Add More Food
                  </Button>
                </Box>
              </Box>
            ) : (
              <Paper elevation={3} sx={{ mb: 2, overflow: "hidden", borderRadius: 2 ,width:'1000px'}}>
                <TableContainer>
                  <Table size="large">
                    <TableHead sx={headerSx}>
                      <TableRow>
                        <TableCell sx={thSx}>Image</TableCell>
                        <TableCell sx={thSx}>Dish</TableCell>
                        <TableCell sx={thSx}>Cuisine</TableCell>
                        <TableCell sx={thSx} align="right">Price</TableCell>
                        <TableCell sx={thSx} align="center">Quantity</TableCell>
                        <TableCell sx={thSx} align="right">Subtotal</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {foodCart.map((food) => (
                        <TableRow key={food.id} hover>
                          <TableCell>
                            <Avatar variant="rounded" src={food.image_url} alt={food.name} sx={{ width: 76, height: 66 }} />
                          </TableCell>
                          <TableCell>{food.name}</TableCell>
                          <TableCell>{food.cuisine}</TableCell>
                          <TableCell align="right">{currency(food.price)}</TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleQuantityChange("food", food.id, "dec")}><Remove /></IconButton>
                            <Chip label={food.quantity} size="small" />
                            <IconButton onClick={() => handleQuantityChange("food", food.id, "inc")}><Add /></IconButton>
                          </TableCell>
                          <TableCell align="right">{currency(food.price * food.quantity)}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleDelete("food", food.id)}><Delete sx={{ color: "red" }} /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
                  <Button component={Link} to="/dine" variant="contained"
                    sx={{ backgroundColor: ACCENT, color: "#ffffff", "&:hover": { backgroundColor: ACCENT_HOVER }, textTransform: "none", fontWeight: "bold" }}>
                    Add More Food
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card
              elevation={4}
              sx={{
                position: { lg: "sticky" },
                top: { lg: 24 },
                borderRadius: 3,
                overflow: "hidden",
                marginTop:'40px',
                bgcolor: isDark ? "#121212" : "#fff",
              }}
            >
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ShoppingCartCheckout sx={{ color: ACCENT }} />
                    <Typography fontWeight={800}>Order Summary</Typography>
                  </Stack>
                }
                sx={{ borderBottom: `1px solid ${isDark ? "#222" : "#eee"}`, bgcolor: isDark ? "#0e0e0e" : "#fafafa" }}
              />
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ opacity: 0.85 }}>Rooms</Typography>
                    <Typography fontWeight={700}>{currency(roomTotal)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ opacity: 0.85 }}>Food</Typography>
                    <Typography fontWeight={700}>{currency(foodTotal)}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Subtotal</Typography>
                    <Typography fontWeight={700}>{currency(baseTotal)}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <LocalOffer sx={{ color: ACCENT }} />
                    <TextField
                      size="small"
                      placeholder="Promo code (WELCOME10)"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <Button variant="outlined" onClick={applyPromo} sx={{ borderColor: ACCENT, color: ACCENT, textTransform: "none" }}>
                      Apply
                    </Button>
                  </Stack>
                  {appliedPromo && (
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                      <Chip label={`${appliedPromo} applied`} color="warning" size="small" />
                      <Typography fontWeight={700} color="success.main">- {currency(discount)}</Typography>
                    </Stack>
                  )}

                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Typography>Taxes (12%)</Typography>
                    <Typography fontWeight={700}>{currency(taxes)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                    <Typography>Service Fee</Typography>
                    <Typography fontWeight={700}>{baseTotal > 0 ? currency(SERVICE_FEE) : currency(0)}</Typography>
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={900} color="success.main">
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={900} color="success.main">
                      {currency(payable)}
                    </Typography>
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handlePayment}
                    sx={{
                      mt: 2,
                      backgroundColor: ACCENT,
                      color: "#ffffff",
                      fontWeight: "bold",
                      textTransform: "none",
                      py: 1.2,
                      "&:hover": { backgroundColor: ACCENT_HOVER },
                    }}
                    disabled={baseTotal === 0}
                  >
                    Proceed to Checkout
                  </Button>

                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                    <Chip label="Free cancellation on select rates" variant="outlined" sx={{ borderColor: ACCENT }} />
                    <Chip label="SSL Secure" variant="outlined" sx={{ borderColor: ACCENT }} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MyCart;
