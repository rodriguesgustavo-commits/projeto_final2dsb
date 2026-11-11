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

        const resultado = await db.pool.query("SELECT * FROM aula")
        res.status(200).json(resultado[0])
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

app.post("/aula", async (req, res) => {
    try {
        const dados = req.body 
        const resultado = await db.pool.query(
            "INSERT INTO aula (serie, turma, componente, professor) VALUES (?, ?, ?, ?)",
            [dados.serie, dados.turma, dados.componente, dados.professor]
        )
        res.status(201).json({resultado: "Aula cadastrado, ID = " + resultado[0].insertID}
        )
     } catch (erro) {
            res.status(500).json({erro: erro.message})
    }
})

app.delete("/aula/:id", async (req, res) => {
    try {
        const id  = req.params;
        const resultado = await db.pool.query("DELETE FROM aula WHERE id = ?", [id])

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Aula não encontrada." })
        }

        res.status(200).json({ resultado: "Aula deletada com sucesso!" })
    } catch (erro) {

        if (erro.errno === 1451) {
            return res.status(400).json({
                erro: "Não é possível excluir esta aula pois existem horários vinculados a ela."
            })
        }
        res.status(500).json({ erro: erro.message })
    }
})

// Cadastrar um novo horário
app.post("/horario", async (req, res) => {
    try {
        const dados = req.body;
        const resultado = await db.pool.query(
            "INSERT INTO horario_aula (idaula, dia_semana, ordem) VALUES (?, ?, ?)",
            [dados.idaula, dados.dia_semana, dados.ordem]
        )
        res.status(201).json({ resultado: "Horário cadastrado, ID = " + resultado[0].insertId })
    } catch (erro) {

        if (erro.errno === 1452) {
            return res.status(400).json({
                erro: "Erro de chave estrangeira: A aula informada (idaula) não existe."
            })
        }
        res.status(500).json({ erro: erro.message })
    }
})

app.get("/horario/:dia", async (req, res) => {
    try {
        const  dia = req.params
        const sql = `
            SELECT h.id, h.dia_semana, h.ordem, a.serie, a.turma, a.componente, a.professor
            FROM horario_aula h
            INNER JOIN aula a ON h.idaula = a.id
            WHERE h.dia_semana = ?
            ORDER BY h.ordem ASC
        `
        const [resultado] = await db.pool.query(sql, [dia])
        res.status(200).json(resultado)
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})

// Deletar um horário pelo ID
app.delete("/horario/:id", async (req, res) => {
    try {
        const  id  = req.params
        const resultado = await db.pool.query("DELETE FROM horario_aula WHERE id = ?", [id])

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Horário não encontrado." })
        }

        res.status(200).json({ resultado: "Horário deletado com sucesso!" })
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})

app.listen(port, ()=>{
    console.log("API rodando na porta " + port)
})

// No Rapid Client:
// GET http://localhost:3000/aula