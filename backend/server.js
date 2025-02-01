import express, { json } from 'express'
import cors from 'cors'
import axios from 'axios';
const app = express();
app.use(cors());
app.get("/api/quiz", async (req, res) => {
    try {
        const response = await axios.get("https://api.jsonserve.com/Uw5CrX");
        console.log(response.data);
        res.json(response.data);  // Send the data back to the client
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quiz data" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
