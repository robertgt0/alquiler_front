import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// 1) -------- Conexión a MongoDB --------
mongoose.connect("mongodb+srv://cmctekk:tekkentag2@cluster0.mvqgnrf.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// 2) -------- Modelo del Ticket --------
const TicketSchema = new mongoose.Schema({
    userId: String,
    mensaje: String,
    servicioDetectado: String,
    fecha: { type: Date, default: Date.now }
});

const Ticket = mongoose.model("Ticket", TicketSchema);

// 3) -------- Rutas de tu API --------

// Crear un ticket
app.post("/api/tickets", async (req, res) => {
    try {
        const ticket = await Ticket.create(req.body);
        res.json({ ok: true, data: ticket });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Buscar tickets por userId
app.get("/api/tickets/:userId", async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.params.userId });
        res.json({ ok: true, data: tickets });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Último ticket
app.get("/api/last/:userId", async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ userId: req.params.userId })
                                   .sort({ fecha: -1 });
        res.json({ ok: true, data: ticket });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.listen(3000, () => console.log("API corriendo en puerto 3000"));

