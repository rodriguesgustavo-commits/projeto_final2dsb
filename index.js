// npm init -> cria o pacote inicial API
// npm i express
const express = require("express")
const app = express()
app.use(express.json())
const port = 3000
// npm i mysql2
const db = require("./db")

app.get("/aula", async (req, res) => {
    try {
        // realiza a consulta ao banco de dados:
        const resultado = await db.pool.query("SELECT * FROM aula")
        res.status(200).json(resultado[0])
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

app.listen(port, ()=>{
    console.log("API rodando na porta " + port)
})

// No Rapid Client:
// GET http://localhost:3000/aula
