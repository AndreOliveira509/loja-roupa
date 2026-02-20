// importar express
const express = require("express");
// importar express-handlebars
const { engine } = require("express-handlebars");

// importar mysql2
const mysql = require("mysql2");   

// app
const app = express();

// configurar express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");    

// configurar conexão
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "projeto"
})
// testar conexão
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log("Conectado ao banco de dados");
})

// Rota Principal
app.get("/", (req, res) => {
    res.render("formulario");
});
// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});