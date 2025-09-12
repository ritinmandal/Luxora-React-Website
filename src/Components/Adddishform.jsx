import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";
import { supabase } from "../Superbase/supabaseClient";

const cuisines = ["Indian", "Chinese", "Mexican", "Thai", "Italian", "Japanese"];

const AddDishForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image_url: "",
    cuisine: "",
    description: "",
    rating: "",
    is_veg: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!userId) {
      setMessage({ type: "error", text: "User not logged in." });
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      user_id: userId,
    };

    const { error } = await supabase.from("dishes").insert([payload]);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Dish added successfully!" });
      setFormData({
        name: "",
        price: "",
        image_url: "",
        cuisine: "",
        description: "",
        rating: "",
        is_veg: false,
      });
    }

    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <TextField
        fullWidth
        name="name"
        label="Dish Name"
        value={formData.name}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        name="price"
        label="Price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        name="image_url"
        label="Image URL"
        value={formData.image_url}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        name="cuisine"
        label="Cuisine"
        select
        value={formData.cuisine}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      >
        {cuisines.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        name="description"
        label="Description"
        multiline
        rows={3}
        value={formData.description}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        name="rating"
        label="Rating"
        type="number"
        inputProps={{ min: 0, max: 5, step: 0.1 }}
        value={formData.rating}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      />

      <FormControlLabel
        control={
          <Switch
            checked={formData.is_veg}
            onChange={handleChange}
            name="is_veg"
            color="success"
          />
        }
        label="Vegetarian"
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ bgcolor: "#c2a76d" }}
      >
        {loading ? "Adding..." : "Add Dish"}
      </Button>
    </Box>
  );
};

export default AddDishForm;
