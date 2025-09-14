import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
  Button,
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BugReportIcon from "@mui/icons-material/BugReport";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { createClient } from "@supabase/supabase-js";
import AddDishForm from "../Components/Adddishform";
import AddRoomForm from "../Components/AddRoomForm";

const supabase = createClient(
  "https://zrnryoyyrmyuzuonyaah.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybnJ5b3l5cm15dXp1b255YWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDY2ODYsImV4cCI6MjA2ODc4MjY4Nn0.LXVb2WhSSsBvOEvKg2yWwNRQ0_m4b7ezPhN3I5e5NT4"
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [dishesCount, setDishesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [dishes, setDishes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase.from("users").select("*");
      const { count: dishes } = await supabase
        .from("dishes")
        .select("*", { count: "exact", head: true });
      const { count: products } = await supabase
        .from("Products")
        .select("*", { count: "exact", head: true });

      setUsers(usersData || []);
      setUsersCount(usersData?.length || 0);
      setDishesCount(dishes || 0);
      setProductsCount(products || 0);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchItems = async () => {
      const { data: dishesData } = await supabase.from("dishes").select("*");
      const { data: roomsData } = await supabase.from("Products").select("*");
      setDishes(dishesData || []);
      setRooms(roomsData || []);
    };
    fetchItems();
  }, []);
  const handleDeleteDish = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This dish will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await supabase.from("dishes").delete().eq("id", id);
      setDishes((prev) => prev.filter((dish) => dish.id !== id));

      Swal.fire("Deleted!", "The dish has been deleted.", "success");
    }
  };

  const handleDeleteRoom = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This room will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await supabase.from("Products").delete().eq("id", id);
      setRooms((prev) => prev.filter((room) => room.id !== id));

      Swal.fire("Deleted!", "The room has been deleted.", "success");
    }
  };

  const stats = [
    {
      icon: <AndroidIcon fontSize="large" />,
      label: "Weekly Sales",
      value: "714k",
      color: "#9acff4ff",
    },
    {
      icon: <AppleIcon fontSize="large" />,
      label: "New Users",
      value: "1.35m",
      color: "#71cc8bff",
    },
    {
      icon: <ShoppingCartIcon fontSize="large" />,
      label: "Item Orders",
      value: "1.72m",
      color: "#ede6a1ff",
    },
    {
      icon: <BugReportIcon fontSize="large" />,
      label: "Bug Reports",
      value: "234",
      color: "#f5bbc3ff",
    },
  ];

  const lineData = [
    { name: "Jan", teamA: 40, teamB: 20, teamC: 18 },
    { name: "Feb", teamA: 24, teamB: 13, teamC: 22 },
    { name: "Mar", teamA: 98, teamB: 40, teamC: 29 },
    { name: "Apr", teamA: 39, teamB: 28, teamC: 30 },
    { name: "May", teamA: 48, teamB: 35, teamC: 32 },
    { name: "Jun", teamA: 38, teamB: 43, teamC: 34 },
    { name: "Jul", teamA: 60, teamB: 46, teamC: 36 },
  ];

  const pieData = [
    { name: "America", value: 400, color: "#0088FE" },
    { name: "Asia", value: 300, color: "#00C49F" },
    { name: "Europe", value: 300, color: "#FFBB28" },
    { name: "Africa", value: 200, color: "#fe6012ff" },
  ];

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={4}
        mt={12}
        textAlign="center"
        sx={{ fontFamily: `'Playfair Display', serif` }}
      >
        Hi, Admin Welcome to your Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper
              sx={{
                mt: 8,
                mx: 3,
                p: 3,
                borderRadius: 2,
                backgroundColor: stat.color,
                textAlign: "center",
              }}
              elevation={3}
            >
              <Avatar
                sx={{
                  mx: "auto",
                  mb: 1,
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  width: 56,
                  height: 56,
                }}
              >
                {stat.icon}
              </Avatar>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#1a1a1a" }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "#1a1a1a" }}>
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, width: "200%" }} elevation={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Website Visits (+43% than last year)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="teamA" stroke="#817afeff" />
                <Line type="monotone" dataKey="teamB" stroke="#00fe61ff" />
                <Line type="monotone" dataKey="teamC" stroke="#f7ac17ff" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        mt={8}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 3, borderRadius: 2, width: "300px", mx: 4 }}
            elevation={3}
          >
            <Typography
              variant="subtitle1"
              textAlign={"center"}
              mb={-5}
              mt={3}
              fontWeight={600}
            >
              Current Visits
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              width: "300px",
              mx: -20,
              p: 3,
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
            elevation={3}
          >
            <Typography variant="subtitle1" fontWeight={600} mt={-5}>
              Database Summary
            </Typography>
            <Box display="flex" justifyContent="space-around" width="100%">
              {[
                {
                  label: "Rooms",
                  value: productsCount,
                  color: "#2c9ffdff",
                  icon: "🏪",
                },
                {
                  label: "Dishes",
                  value: dishesCount,
                  color: "#f5970bff",
                  icon: "🍽️",
                },
                {
                  label: "Users",
                  value: usersCount,
                  color: "#fc1c67ff",
                  icon: "👥",
                },
              ].map((item, index) => (
                <Box key={index} textAlign="center">
                  <ResponsiveContainer width={80} height={80}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "count", value: item.value },
                          { name: "remainder", value: 100 - item.value },
                        ]}
                        innerRadius={25}
                        outerRadius={35}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill={item.color} />
                        <Cell fill="#e0e0e0" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Typography variant="h6">{item.value}</Typography>
                  <Typography variant="body2">{item.label}</Typography>
                  <Typography sx={{ fontSize: 30 }}>{item.icon}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: 360,
              overflowY: "auto",
              width: "638px",
              mx: 3,
            }}
            elevation={3}
          >
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              All Users
            </Typography>
            {users.map((user, i) => (
              <Box key={i} mb={1}>
                <Typography fontWeight={500}>
                  {user.name || "Unnamed User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <hr />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8} mx={5} mt={10}>
        <Accordion elevation={3} sx={{ borderRadius: 2, width: "1400px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ mx: 4 }} fontWeight="bold">
              Add New Dish
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AddDishForm />
          </AccordionDetails>
        </Accordion>
        <Accordion
          elevation={3}
          sx={{ borderRadius: 2, width: "1400px", mt: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ mx: 4 }} fontWeight={"bold"}>
              Add New Room
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AddRoomForm />
          </AccordionDetails>
        </Accordion>
        <Accordion
          elevation={3}
          sx={{ borderRadius: 2, mt: 2, width: "1400px" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ mx: 4 }} fontWeight="bold">
              All Dishes
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Box>
              <Grid container sx={{ fontWeight: "bold", mb: 1, mx: 4 }}>
                <Grid item xs={4}>
                  <Typography>Name</Typography>
                </Grid>
                <Grid item xs={2} sx={{ mx: 2 }}>
                  <Typography>Price</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>Description</Typography>
                </Grid>
              </Grid>
              <Divider />

              {dishes?.map((dish) => (
                <Grid
                  container
                  key={dish.id}
                  alignItems="center"
                  sx={{ py: 1, borderBottom: "1px solid #e0e0e0" }}
                >
                  <Grid item xs={4} sx={{ mx: 4 }}>
                    <Typography>{dish.name}</Typography>
                    <Typography>₹{dish.price}</Typography>
                    <Typography fontSize={13}>
                      {dish.description || "No description"}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      mx: 100,
                      mb: 5,
                      mt: -5,
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="start"
                      sx={{ gap: 5, display: "flex", flexDirection: "row" }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteDish(dish.id)}
                      >
                        DELETE
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion elevation={3} sx={{ borderRadius: 2, mt: 2, width: "1400px" }}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography fontWeight="bold" sx={{ px: 2,mx:2 }}>
      All Rooms
    </Typography>
  </AccordionSummary>

  <AccordionDetails>
    <Box>
    
      <Grid container sx={{ fontWeight: "bold", mb: 1, px: 2,mx:2 }}>
        <Grid item xs={4}>
          <Typography>Name</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography sx={{ mx: 4 }}>Price</Typography>
        </Grid>
        
      </Grid>
      <Divider />

    
      {rooms?.map((room) => (
        <Grid
          container
          key={room.id}
          alignItems="center"
          sx={{ py: 1, borderBottom: "1px solid #e0e0e0", px: 2 }}
        >
          <Grid item xs={4} sx={{ mx: 2 }}>
            <Typography>{room.name}</Typography>
            <Typography >₹{room.price}</Typography>
            

          </Grid>

          <Grid item xs={2}sx={{mx:100,mt:-5}}>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDeleteRoom(room.id)}
              >
                DELETE
              </Button>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Box>
  </AccordionDetails>
</Accordion>

      </Grid>
    </Box>
  );
};

export default AdminDashboard;
