import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Create a new order
export const createOrder = async (order) =>
  await axios.post(`${API_BASE_URL}/order`, order);

// Get all orders
export const getOrders = async () => await axios.get(`${API_BASE_URL}/orders`);

// Get a single order by ID
export const getOrder = async (id) =>
  await axios.get(`${API_BASE_URL}/order/${id}`);

// Update an order by ID
export const updateOrder = async (id, order) =>
  await axios.put(`${API_BASE_URL}/order/${id}`, order);

// Delete an order by ID
export const deleteOrder = async (id) =>
  await axios.delete(`${API_BASE_URL}/order/${id}`);
