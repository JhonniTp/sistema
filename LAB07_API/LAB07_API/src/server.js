const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const facturaRoutes = require("./routes/facturaRoutes");

const app = express();
const PORT = 3000;

// Middleware para CORS
app.use(cors({
  origin: '*', // Permite solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para JSON
app.use(bodyParser.json());

// Rutas
app.use("/api/facturas", facturaRoutes);

// Servidor en marcha
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
