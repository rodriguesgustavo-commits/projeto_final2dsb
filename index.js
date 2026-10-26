// npm init -> cria o pacote inicial API
const express = require("express")
const app = express ()
app.use(express.json())
const port = 3000
const db = require("./db")


app.get("/aula", (req, res) => {
    // conectar ao banco de dados
    try {
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
// GET http://127.0.0.1:3000/aula