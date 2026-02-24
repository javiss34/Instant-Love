import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get('/api/saludo', (req,res) => {
    res.json({mensaje: 'Esto es Instant Love'})
})

app.listen(PORT, () => {
    console.log(`server on port http://localhost:${PORT}`)
})