import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { supabase } from "../Superbase/supabaseClient"; 

const AddRoomForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image_url: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    const { error } = await supabase.from("Products").insert([payload]);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Room added successfully!" });
      setFormData({ name: "", price: "", image_url: "" });
    }

    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Add a New Room</Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Room Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Image URL"
        name="image_url"
        value={formData.image_url}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <Button
        sx={{ bgcolor: '#c2a76d' }}
        variant="contained"
        type="submit"
        disabled={loading}
        fullWidth
      >
        {loading ? "Adding..." : "Add Room"}
      </Button>
    </Box>
  );
};

export default AddRoomForm;
