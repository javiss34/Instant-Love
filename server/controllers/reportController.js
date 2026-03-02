import { Report } from "../models/index.js"

const crearReporte = async (req, res) => {
    try {
        const { reporteroId, acusadoId, callId, motivo } = req.body

        if (!reporteroId || !acusadoId || !callId || !motivo) {
            return res.status(400).json({mensaje: "Faltan datos para procesar el reporte"})
        }

        const nuevoReporte = await Report.create({
            reporteroId,
            acusadoId,
            callId: callId || null,
            motivo,
            estado: "PENDIENTE"
        })

        return res.status(201).json({
            mensaje: "Reporte creado correctamente",
            reporte: nuevoReporte
        })

    } catch (error) {
        console.error("Error al crear el reporte:", error)
        return res.status(500).json({mensaje: "Error al crear el reporte", error: error.message})
    }
}

const obtenerReportes = async (req, res) => {
    try {
        const reportes = await Report.findAll({
            order: [["createdAt", "DESC"]]
        })
        res.status(200).json(reportes)
    } catch (error) {
        console.error("Error al obtener los reportes:", error)
        return res.status(500).json({mensaje: "Error al obtener los reportes", error: error.message})
    }
}

export { crearReporte, obtenerReportes }