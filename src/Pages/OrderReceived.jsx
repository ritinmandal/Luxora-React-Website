import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../Superbase/supabaseClient';
import BookingBanner from '../Components/BookingBanner';

const OrderReceived = () => {
  const location = useLocation();
  const order = location.state;
  const paymentMethod = order?.paymentMethod;
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [user, setUser] = useState({ email: '', name: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authUser } = await supabase.auth.getUser();
      const userId = authUser?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setUser({ email: data.email, name: data.name });
      }
    };

    fetchUser();
  }, []);

  if (!order) return <Typography>Invalid Access</Typography>;

  const handleDownload = async () => {
    const doc = new jsPDF();
    const now = new Date();

    const logoImg = new Image();
    logoImg.src = '/logo-bg1.png';

    const qrImg = new Image();
    qrImg.src = '/frame.png';

    logoImg.onload = () => {
      qrImg.onload = () => {
        doc.setFillColor(255, 245, 235);
        doc.rect(0, 0, 210, 40, 'F');

        doc.addImage(logoImg, 'PNG', 14, 8, 30, 25);

        doc.setFontSize(22);
        doc.setTextColor(80, 60, 30);
        doc.setFont('times', 'bold');
        doc.text('LUXORA STAY INVOICE', 105, 18, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text('Your Complete Booking Summary', 105, 26, { align: 'center' });

        doc.setTextColor(40);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Customer Information', 14, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${user.name || order.userName}`, 14, 58);
        doc.text(`Email: ${user.email}`, 14, 65);
        doc.text(`Booking ID: ${order.bookingId}`, 14, 72);
        doc.text(`Date: ${now.toLocaleDateString()}`, 14, 79);
        doc.text(`Payment: ${paymentMethod === 'card' ? 'Card' : 'Cash On Delivery'}`, 14, 86);

        let yPos = 96;

        if (order.rooms.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.text('Room Booking Details', 14, yPos);
          yPos += 4;

          autoTable(doc, {
            startY: yPos,
            head: [['Room', 'Type', 'Rate/Night', 'Nights', 'Subtotal']],
            body: order.rooms.map((r) => [
              r.name,
              r.type,
              `${r.price}`,
              r.nights,
              `${r.price * r.nights}`,
            ]),
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [191, 162, 108], textColor: 255 },
            alternateRowStyles: { fillColor: [250, 250, 250] },
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }

        if (order.foods.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.text('Ordered Food Items', 14, yPos);
          yPos += 4;

          autoTable(doc, {
            startY: yPos,
            head: [['Dish', 'Cuisine', 'Price', 'Qty', 'Subtotal']],
            body: order.foods.map((f) => [
              f.name,
              f.cuisine,
              `${f.price}`,
              f.quantity,
              `${f.price * f.quantity}`,
            ]),
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [204, 51, 63], textColor: 255 },
            alternateRowStyles: { fillColor: [255, 248, 248] },
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }

        const discount = Math.round(order.total * 0.1);
        const totalAfterDiscount = order.total - discount;
        const gst = Math.round(totalAfterDiscount * 0.12);
        const totalWithGST = totalAfterDiscount + gst;

        doc.setDrawColor(120, 94, 38);
        doc.setFillColor(250, 240, 210);
        doc.rect(14, yPos, 180, 65, 'FD');

        doc.setFont('helvetica');
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Subtotal: ${order.total}`, 20, yPos + 8);
        doc.text(`Discount (10%): -${discount}`, 20, yPos + 15);
        doc.text(`After Discount: ${totalAfterDiscount}`, 20, yPos + 22);
        doc.text(`GST (12%): ${gst}`, 20, yPos + 29);
        doc.text(`Grand Total: ${totalWithGST}`, 20, yPos + 36);

        doc.addImage(qrImg, 'PNG', 150, yPos + 2, 35, 35);
        yPos += 50;

        doc.setFont('courier', 'italic');
        doc.setTextColor(80);
        doc.text('Authorized Signature', 14, yPos + 20);
        doc.line(14, yPos + 18, 70, yPos + 18);

        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.setFont('helvetica', 'italic');
        doc.text(
          'Terms & Conditions: This invoice is system-generated. All bookings are subject to hotel policies. For support, contact our helpline.',
          14,
          yPos + 35,
          { maxWidth: 180 }
        );

        doc.save('Luxora_Hotel_Invoice.pdf');
      };
    };
  };

  const discount = Math.round(order.total * 0.1);
  const totalAfterDiscount = order.total - discount;
  const gst = Math.round(totalAfterDiscount * 0.12);
  const totalWithGST = totalAfterDiscount + gst;

  const bgColor = isDark ? theme.palette.background.paper : '#fff';
  const textColor = isDark ? '#f1f1f1' : '#2c2c2c';
  const subTextColor = isDark ? '#bdbdbd' : '#9e9e9e';

  return (
    <>
      <BookingBanner />
      <Box p={4}>
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            mb: 4,
            mt: -1,
            borderRadius: 2,
            backgroundColor: bgColor,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: textColor }}>
              Thank You For Your Booking!
            </Typography>
            <Typography sx={{ color: subTextColor }}>
              Your booking has been <strong>received</strong>
            </Typography>
          </Box>

          <Link to="/">
            <Button
              sx={{
                backgroundColor: '#bfa26c',
                color: '#fff',
                borderRadius: '8px',
                px: 3,
                py: 1,
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#d43f3f' },
              }}
            >
              Back Home
            </Button>
          </Link>
        </Paper>

        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: bgColor,
            color: textColor,
            fontFamily: 'Roboto, sans-serif',
            boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
            border: '1px solid #e0d2b4',
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Booking Summary
          </Typography>
          <Divider sx={{ my: 2, borderColor: isDark ? '#555' : '#ccc' }} />

          <Typography><strong>Name:</strong> {user.name || order.userName}</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
          <Typography><strong>Booking ID:</strong> {order.bookingId}</Typography>
          <Typography><strong>Total Rooms:</strong> {order.rooms.length}</Typography>
          <Typography><strong>Total Food Items:</strong> {order.foods.length}</Typography>
          <Typography><strong>Payment Method:</strong> {paymentMethod === 'card' ? 'Card Payment' : 'Cash On Delivery'}</Typography>

          <Typography mt={2}><strong>Subtotal:</strong> ₹{order.total}</Typography>
          <Typography><strong>Discount (10%):</strong> -₹{discount}</Typography>
          <Typography><strong>After Discount:</strong> ₹{totalAfterDiscount}</Typography>
          <Typography><strong>GST (12%):</strong> ₹{gst}</Typography>
          <Typography fontWeight="bold"><strong>Grand Total:</strong> ₹{totalWithGST}</Typography>

          <Box mt={4} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Button
              onClick={handleDownload}
              sx={{
                backgroundColor: isDark ? '#333' : '#000',
                color: '#fff',
                px: 3,
                py: 1,
                fontWeight: 'bold',
                borderRadius: 1,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: isDark ? '#444' : '#222',
                },
              }}
            >
              Download Your Bill
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: isDark ? '#555' : '#ccc' }} />
          <Typography variant="caption" sx={{ color: subTextColor }}>
            Invoice generated by Hotel Booking System — {new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default OrderReceived;
