import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails,
  Box, Typography, TextField, Button, FormControl,
  RadioGroup, Radio, FormControlLabel, Paper, Divider, Grid,
  useTheme, Stack, Chip, Checkbox, Tooltip, InputAdornment, Card, CardHeader, CardContent
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutBanner from "../Components/CheckoutBanner";
import toast from "react-hot-toast";

const ACCENT = "#c2a15f";
const ACCENT_HOVER = "#af8f52";
const TAX_RATE = 0.12;          
const SERVICE_FEE = 199;        

const PaymentGateway = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const roomTotal = state?.roomTotal || 0;
  const foodTotal = state?.foodTotal || 0;
  const baseTotal = state?.baseTotal ?? (roomTotal + foodTotal);
  const preFees = baseTotal; 

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");


  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const code = appliedCoupon.toUpperCase();
    if (code === "LUXORA10") return Math.floor(preFees * 0.10);
    if (code === "FOOD50" && foodTotal >= 999) return 50;
    return 0;
  }, [appliedCoupon, preFees, foodTotal]);

  const taxable = Math.max(0, preFees - discount);
  const taxes = Math.floor(taxable * TAX_RATE);
  const total = Math.max(0, taxable + taxes + (preFees > 0 ? SERVICE_FEE : 0));

  const handleApplyCoupon = () => {
    const code = (coupon || "").trim().toUpperCase();
    if (!code) return;
    if (["LUXORA10", "FOOD50"].includes(code)) {
      setAppliedCoupon(code);
      toast.success(`Coupon ${code} applied`);
    } else {
      setAppliedCoupon(null);
      toast.error("Invalid coupon code.");
    }
  };

  const [billing, setBilling] = useState({
    first: "",
    last: "",
    age: "",
    contact: "",
    address: "",
    pincode: "",
    email: "",
    phone: "",
    gstin: "",
    notes: "",
    consent: true,
  });
  const [errors, setErrors] = useState({});

  const setField = (k, v) => {
    setBilling((b) => ({ ...b, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!billing.first.trim()) e.first = "Required";
    if (!billing.last.trim()) e.last = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((billing.email || "").trim())) e.email = "Invalid email";
    if (!/^\+?\d{7,15}$/.test((billing.phone || "").trim())) e.phone = "Invalid phone";
    if (!billing.address.trim()) e.address = "Required";
    if (!billing.pincode.trim()) e.pincode = "Required";
    if (!billing.consent) e.consent = "Please accept to proceed";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [card, setCard] = useState({
    holder: "",
    number: "",
    cvv: "",
    exp: "", 
    save: false,
  });
  const setCardField = (k, v) => setCard((c) => ({ ...c, [k]: v }));

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();

  const handleCheckout = () => {
    if (!validate()) {
      toast.error("Fill up all details to proceeed.");
      return;
    }
    if (paymentMethod === "card") {
      if (!card.holder.trim()) return toast.error("Enter card holder name");
      if (!/^\d{12,19}$/.test(card.number.replace(/\s/g, ""))) return toast.error("Enter valid card number");
      if (!/^\d{3,4}$/.test(card.cvv)) return toast.error("Invalid CVV");
      if (!card.exp) return toast.error("Select expiry");
    }

    setTimeout(() => {
      toast.success("Your booking is successful!", {
        style: { border: `1px solid ${ACCENT}`, padding: "16px", color: theme.palette.text.primary },
        iconTheme: { primary: ACCENT, secondary: "#ffffff" },
      });

      navigate("/order_received", {
        state: {
          ...state,
          paymentMethod,
          finalTotal: total,
          isCouponApplied: Boolean(appliedCoupon),
          coupon: appliedCoupon,
          billing,
        },
      });
    }, 650);
  };

  const paymentLogos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg", alt: "Visa" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", alt: "MasterCard" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", alt: "PayPal" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/1/16/UnionPay_logo.svg", alt: "UnionPay" },
  ];

  const rooms = state?.rooms || [];
  const foods = state?.foods || [];

  const currency = (v) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

  useEffect(() => {
    if (!state) {
      toast.error("Your cart is empty.");
      navigate("/rooms");
    }
  }, []);

  return (
    <>
      <CheckoutBanner />

      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 }, minHeight: "100vh" }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
              <Accordion sx={{ mb: 2, borderRadius: 2 }} TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalOfferIcon sx={{ color: ACCENT }} />
                    <Typography>Have a Coupon? Click here to enter your code.</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <TextField
                      fullWidth
                      placeholder="Enter coupon code (LUXORA10 / FOOD50)"
                      size="small"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      onClick={handleApplyCoupon}
                      sx={{ bgcolor: ACCENT, "&:hover": { bgcolor: ACCENT_HOVER }, textTransform: "none", fontWeight: 700 }}
                    >
                      Apply
                    </Button>
                  </Stack>
                  {appliedCoupon && (
                    <Typography variant="body2" sx={{ mt: 1.5, color: "success.main" }}>
                      Applied: <b>{appliedCoupon}</b> — Saving {currency(discount)}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded sx={{ mb: 2, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BadgeIcon sx={{ color: ACCENT }} />
                    <Typography>Billing Address</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="First Name" value={billing.first}
                        onChange={(e) => setField("first", e.target.value)}
                        error={!!errors.first} helperText={errors.first}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Last Name" value={billing.last}
                        onChange={(e) => setField("last", e.target.value)}
                        error={!!errors.last} helperText={errors.last}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Age" value={billing.age} onChange={(e) => setField("age", e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Contact" value={billing.contact} onChange={(e) => setField("contact", e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth label="Address" value={billing.address}
                        onChange={(e) => setField("address", e.target.value)}
                        error={!!errors.address} helperText={errors.address}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Pin Code" value={billing.pincode}
                        onChange={(e) => setField("pincode", e.target.value)}
                        error={!!errors.pincode} helperText={errors.pincode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Email Address" value={billing.email}
                        onChange={(e) => setField("email", e.target.value)}
                        error={!!errors.email} helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth label="Phone Number" value={billing.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        error={!!errors.phone} helperText={errors.phone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="GSTIN (optional)" value={billing.gstin} onChange={(e) => setField("gstin", e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth multiline rows={3} label="Notes for the hotel (optional)"
                        value={billing.notes} onChange={(e) => setField("notes", e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                    <Checkbox checked={billing.consent} onChange={(e) => setField("consent", e.target.checked)} />
                    <Typography variant="body2">
                      I agree to the <b>Terms</b> and <b>Privacy Policy</b>.
                    </Typography>
                  </Stack>
                  {errors.consent && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.consent}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded sx={{ mb: 2, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CreditCardIcon sx={{ color: ACCENT }} />
                    <Typography>Payment Method</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl component="fieldset" sx={{ mb: 1 }}>
                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} row>
                      <FormControlLabel value="card" control={<Radio />} label="Pay by Card" />
                      <FormControlLabel value="cod" control={<Radio />} label="Pay at Hotel" />
                    </RadioGroup>
                  </FormControl>

                  {paymentMethod === "card" && (
                    <Box sx={{ mt: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                        {paymentLogos.map((logo, idx) => (
                          <Box key={idx} sx={{ border: '1px solid #ddd', borderRadius: 1, p: 0.75, bgcolor: theme.palette.background.paper }}>
                            <Box component="img" src={logo.src} alt={logo.alt} sx={{ height: 28 }} />
                          </Box>
                        ))}
                      </Stack>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth label="Card Holder Name" value={card.holder}
                            onChange={(e) => setCardField("holder", e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" /></InputAdornment> }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth label="Card Number" value={card.number}
                            onChange={(e) => setCardField("number", formatCard(e.target.value))}
                            inputMode="numeric"
                            placeholder="0000 0000 0000 0000"
                            InputProps={{ startAdornment: <InputAdornment position="start"><CreditCardIcon fontSize="small" /></InputAdornment> }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth label="CVV" value={card.cvv}
                            onChange={(e) => setCardField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                            inputMode="numeric"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth label="Expiry" type="month" value={card.exp}
                            onChange={(e) => setCardField("exp", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonthIcon fontSize="small" /></InputAdornment> }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={<Checkbox checked={card.save} onChange={(e) => setCardField("save", e.target.checked)} />}
                            label="Securely save this card for future bookings"
                          />
                        </Grid>
                      </Grid>

                      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
                        <Chip icon={<LockIcon />} label="SSL Secured" variant="outlined" sx={{ borderColor: ACCENT }} />
                        <Chip icon={<VerifiedUserIcon />} label="Trusted Payments" variant="outlined" sx={{ borderColor: ACCENT }} />
                      </Stack>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2, py: 1.4, bgcolor: ACCENT, color: "#111",
                  textTransform: "none", fontWeight: 800, borderRadius: 2,
                  "&:hover": { bgcolor: ACCENT_HOVER }
                }}
                onClick={handleCheckout}
              >
                Confirm & Pay {paymentMethod === "card" ? currency(total) : ""}
              </Button>

              <Typography variant="caption" sx={{ display: "block", mt: 1.5, opacity: 0.7 }}>
                By placing this booking, you agree to our Terms & Conditions and Privacy Policy.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card
              elevation={4}
              sx={{
                position: { lg: "sticky" },
                top: { lg: 24 },
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <CardHeader
                title={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ShoppingBagIcon sx={{ color: ACCENT }} />
                    <Typography fontWeight={800}>Order Summary</Typography>
                  </Stack>
                }
                sx={{ borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.action.hover }}
              />
              <CardContent sx={{width:'1450px'}}>
                
                {!!rooms.length && (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5, opacity: 0.75 }}>
                      Rooms
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 1.5 }}>
                      {rooms.map((r) => (
                        <Stack key={r.id} direction="row" justifyContent="space-between">
                          <Typography variant="body2">{r.name} × {r.nights || 1}</Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {currency((r.price || 0) * (r.nights || 1))}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}

                {!!foods.length && (
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5, opacity: 0.75 }}>
                      Food
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 1.5 }}>
                      {foods.map((f) => (
                        <Stack key={f.id} direction="row" justifyContent="space-between">
                          <Typography variant="body2">{f.name} × {f.quantity || 1}</Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {currency((f.price || 0) * (f.quantity || 1))}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ opacity: 0.85 }}>Subtotal</Typography>
                  <Typography fontWeight={700}>{currency(preFees)}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                  <Typography>Discount {appliedCoupon ? `(${appliedCoupon})` : ""}</Typography>
                  <Typography fontWeight={700} color={discount ? "success.main" : "text.primary"}>
                    {discount ? `- ${currency(discount)}` : currency(0)}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                  <Typography>Taxes (12%)</Typography>
                  <Typography fontWeight={700}>{currency(taxes)}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                  <Typography>Service Fee</Typography>
                  <Typography fontWeight={700}>{preFees > 0 ? currency(SERVICE_FEE) : currency(0)}</Typography>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={900} color="success.main">Total</Typography>
                  <Typography variant="h6" fontWeight={900} color="success.main">{currency(total)}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
                  <Chip size="small" variant="outlined" label="Free cancellation on select rates" sx={{ borderColor: ACCENT }} />
                  <Chip size="small" variant="outlined" icon={<LockIcon />} label="Secure checkout" sx={{ borderColor: ACCENT }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PaymentGateway;
