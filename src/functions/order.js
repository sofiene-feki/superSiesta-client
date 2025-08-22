import axios from "axios";

const API_BASE_URL = "https://supersiesta-server-i63m.onrender.com/api"; // change to your server URL

// ✅ Get all orders
export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response; // you can use response.data in your components
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    throw error;
  }
};

// ✅ Get order by ID
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/order/${id}`);
    return response;
  } catch (error) {
    console.error(`❌ Error fetching order ${id}:`, error.message);
    throw error;
  }
};

// ✅ Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/order/create`,
      orderData
    );
    return response;
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    throw error;
  }
};

// ✅ Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/order/${id}/status`, {
      status,
    });
    return response;
  } catch (error) {
    console.error(`❌ Error updating order ${id} status:`, error.message);
    throw error;
  }
};

// ✅ Delete order
export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/order/${id}`);
    return response;
  } catch (error) {
    console.error(`❌ Error deleting order ${id}:`, error.message);
    throw error;
  }
};
