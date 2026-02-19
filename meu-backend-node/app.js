// importar express
const express = require("express");

// app
const app = express();

// Rota hello world
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// Iniciar servidor
app.listen(3000,() => {
    console.log("Servidor rodando na porta 3000");
});