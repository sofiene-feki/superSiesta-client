import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useSelector } from "react-redux";
import { EyeIcon, TrashIcon, WrenchIcon } from "@heroicons/react/24/outline";
//import { createOrder, getOrders } from "../../functions/order";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { deleteOrder, getOrders } from "../functions/order";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CustomToolbar from "../components/ui/CustomToolbar";
import { getAllProductTitles } from "../functions/product";
//import SideNavModal from "../../components/pageProps/shopPage/shopBy/SideNavModal";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await getOrders(); // fetch all orders from API

      const formatted = res.data.map((order, index) => ({
        id: order._id,
        index: index + 1,
        clientName: order.customer?.fullName || "", // customer name
        email: order.customer?.email || "", // email if stored
        phone: order.customer?.phone || "",
        adresse: order.customer?.address || "",
        status: order.status || "",
        productCount: order.items?.length || 0, // number of items
        subtotal: order.subtotal || 0,
        shipping: order.shipping || 0,
        total: order.total || 0,
        createdAt: new Date(order.createdAt).toLocaleString(),
      }));

      setOrders(formatted);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?"))
      return;

    try {
      await deleteOrder(id);
      alert("Commande supprimée avec succès !");
      // Refresh your orders list
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la commande.");
    }
  };

  const columns = [
    { field: "index", headerName: "#", width: 70 },
    { field: "clientName", headerName: "Client", width: 200 },
    { field: "adresse", headerName: "Adresse", width: 200 },
    { field: "phone", headerName: "Télephone", width: 130 },
    { field: "productCount", headerName: "Nbr produit", width: 90 },
    {
      field: "total",
      headerName: "total",
      width: 90,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return null;

        let color = "default";
        switch (params.value.toLowerCase()) {
          case "delivered":
            color = "success";
            break;
          case "confirmed":
            color = "error";
            break;
          case "pending":
            color = "warning";
            break;
          default:
            color = "default";
        }

        return <Chip label={params.value} color={color} variant="outlined" />;
      },
    },
    { field: "createdAt", headerName: "Date", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <Tooltip title="voir" arrow key="view">
          <GridActionsCellItem
            icon={<EyeIcon className="w-6 h-6" />}
            label="open"
            component={Link}
            to={`/order/${params.row.id}`}
          />
        </Tooltip>,
        <GridActionsCellItem
          key="edit"
          icon={<WrenchIcon className="w-6 h-6" />}
          label="Edit"
          component={Link}
          to={`/order/${params.row.id}`}
          showInMenu
        />,
        <GridActionsCellItem
          key="delete"
          icon={<TrashIcon className="w-6 h-6" />}
          label="Delete"
          onClick={() => handleDelete(params.id)} // pass the id here
          showInMenu
        />,
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);
    const fetchTitles = async () => {
      try {
        const res = await getAllProductTitles();
        setProducts(res);
      } catch (err) {
        console.error("❌ Error fetching titles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTitles();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-7xl mx-auto md:py-16 py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900">
          Suivi des commandes
        </h1>
        {/* <Breadcrumbs title="Finaliser votre commande" /> */}
        <Box
          sx={{
            height: 400,
            width: "100%",
            "& .super-app-theme--cell": {
              backgroundColor: "rgba(224, 183, 60, 0.55)",
              color: "#1a3e72",
              fontWeight: "600",
            },
            "& .super-app.negative": {
              backgroundColor: "rgba(157, 255, 118, 0.49)",
              color: "#1a3e72",
              fontWeight: "600",
            },
            "& .super-app.positive": {
              backgroundColor: "#d47483",
              color: "#1a3e72",
              fontWeight: "600",
            },
            "& .status-pending": {
              backgroundColor: "rgba(224, 183, 60, 0.55)",
              color: "#1a3e72",
              fontWeight: "600",
              borderRadius: "4px",
              padding: "2px 8px",
              display: "inline-block",
              textAlign: "center",
            },
            "& .status-shipped": {
              backgroundColor: "rgba(157, 255, 118, 0.49)",
              color: "#1a3e72",
              fontWeight: "600",
              borderRadius: "4px",
              padding: "2px 8px",
              display: "inline-block",
              textAlign: "center",
            },
            "& .status-delivered": {
              // backgroundColor: "#1ae06dff",
              color: "#1ae06dff",
              fontWeight: "600",
              borderRadius: "4px",
              padding: "1px 1px",
              display: "inline-block",
              textAlign: "center",
            },
          }}
        >
          {" "}
          <DataGrid
            rows={orders}
            columns={columns}
            loading={false}
            pageSize={10}
            slots={{ toolbar: CustomToolbar }}
            slotProps={{
              toolbar: { products },
            }}
            showToolbar
          />
        </Box>
      </div>
    </div>
  );
};

export default Order;
