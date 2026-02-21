// importar express
const express = require("express");
// importar express-handlebars
const { engine } = require("express-handlebars");
// importar mysql2
const mysql = require("mysql2");  
// importar multer
const multer = require("multer");

// app
const app = express();

//Configurar o multer para salvar as imagens em uma pasta chamada "uploads"
const upload = multer({ dest: "uploads/" });

// Adicionar css
app.use('/css', express.static("./css"));

// configurar express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Manipulação de dados via rotas
app.use(express.json());
// SEMPRE QUANDO TEM UM FORMULARIO
app.use(express.urlencoded({ extended: false }));

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

// Rota de cadastro
// NOVO: Adicionar o 'upload.single("imagem")' na rota
// O "imagem" tem que ser exatamente o mesmo nome que está no atributo 'name' do input do HTML
app.post("/cadastrar", upload.single("imagem"), (req, res) => {
    console.log("DADOS DOS TEXTOS:", req.body); // Agora o nome e o preço vão aparecer aqui!
    console.log("DADOS DO ARQUIVO:", req.file); // E os dados da imagem salva vão aparecer aqui!
    
    res.send("Recebido com sucesso!");
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});