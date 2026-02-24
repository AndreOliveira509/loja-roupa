// importar express
const express = require("express");
// importar express-handlebars
const { engine } = require("express-handlebars");
// importar mysql2
const mysql = require("mysql2");
// NOVO: importar express-fileupload
const fileupload = require("express-fileupload");

// app
const app = express();

// Adicionar css
app.use('/css', express.static("./css"));

// configurar express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// NOVO: Ativar o express-fileupload
app.use(fileupload());

// configurar conexão
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "projeto"
});

// testar conexão
conexao.connect(function (erro) {
    if (erro) throw erro;
    console.log("Conectado ao banco de dados");
});

// Rota Principal
app.get("/", (req, res) => {
    res.render("formulario");
});

// Rota de cadastro enxuta!
app.post("/cadastrar", (req, res) => {
    // 1. Pega os dados
    let nome = req.body.nome;
    let valor = req.body.valor; 
    let imagem = req.files.imagem.name; 

    // 2. Monta o SQL (com os ? para não dar erro de aspas)
    let sql = "INSERT INTO produtos (nome, valor, imagem) VALUES (?, ?, ?)";
    
    // 3. Executa no banco e salva a foto
    conexao.query(sql, [nome, valor, imagem], (erro, resultado) => {
        if (erro) throw erro;
        
        // Move a foto para a pasta images
        req.files.imagem.mv(__dirname + '/images/' + imagem); 
        
        console.log(resultado);
        res.send("Produto salvo com sucesso no banco e na pasta!");
    });
    // Retornar para a página inicial
    res.redirect("/");
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});