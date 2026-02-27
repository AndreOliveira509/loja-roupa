// importar express
const express = require("express");
// importar express-handlebars
const { engine } = require("express-handlebars");
// importar mysql2
const mysql = require("mysql2");
// importar express-fileupload
const fileupload = require("express-fileupload");

// importar fs (file system)
const fs = require("fs");

// app
const app = express();

// Adicionar css
app.use('/css', express.static("./css"));

// Adicionar imagens
app.use('/images', express.static("./images"));

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
    // SQL
    let sql = "SELECT * FROM produtos";
    // Executa no banco
    conexao.query(sql, (erro, resultado) => {
        if (erro) throw erro;
        res.render("formulario", { produtos: resultado });
    });
});

// Rota Principal contendo a situação
app.get("/:situacao", (req, res) => {
    // SQL
    let sql = "SELECT * FROM produtos";
    // Executa no banco
    conexao.query(sql, (erro, resultado) => {
        if (erro) throw erro;
        res.render("formulario", { produtos: resultado, situacao: req.params.situacao });
    });
});

// Rota de cadastro enxuta!
app.post("/cadastrar", (req, res) => {
   try{
     // 1. Pega os dados
    let nome = req.body.nome;
    let valor = req.body.valor;
    let imagem = req.files.imagem.name;

    // validar o nome do produto e o valor
    if(nome == '' || valor == '' || isNaN(valor)){
        res.redirect("/falhaCadastro");
    }else{
        // 2. Monta o SQL
        let sql = "INSERT INTO produtos (nome, valor, imagem) VALUES (?, ?, ?)";

        // 3. Executa no banco e salva a foto
        conexao.query(sql, [nome, valor, imagem], (erro, resultado) => {
            if (erro) throw erro;

            // Move a foto para a pasta images
            req.files.imagem.mv(__dirname + '/images/' + imagem);

            console.log("Salvo com sucesso! ID do produto:", resultado.insertId);

            // 4. A RESPOSTA FINAL (Fica aqui dentro!)
            // Como você tinha colocado um redirect, vou manter ele como padrão.
            // Assim, quando o cara cadastrar, a tela pisca e volta pro formulário limpo.
            res.redirect("/okCadastro");
    });
    }
   }catch(erro){
    res.redirect("/falhaCadastro");
   }
});

// rota de delete
app.get("/deletar/:codigo&:imagem", (req, res) => {
    
    // Tratamento de exeção
    try{
        let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

        conexao.query(sql, (erro, resultado) => {
            if (erro) throw erro;
            fs.unlink(__dirname + '/images/' + req.params.imagem, (erro_imagem) => {
                if (erro_imagem) console.log("Imagem deu ERRO!");
            });
        });
    res.redirect("/okDelete");
    }catch(erro){
        res.redirect("/falhaDelete");
    }

});

// Rota para redirecionar para o formulário de edição
app.get("/formularioEditar/:codigo", (req, res) => {
    // sql
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;
    // executar comando sql 
    conexao.query(sql, (erro, retorno) => {
        // Caso haja falha no comando
        if (erro) throw erro;
        // Caso funcione
        res.render("formularioEditar", { produto: retorno[0] });
    })
});

// Rota para editar produtos
app.post("/editar", (req, res) => {
    // obter dados
    let codigo = req.body.codigo;
    let nome = req.body.nome;
    let valor = req.body.valor;
    let nomeImagem = req.body.nomeImagem;

    // validar o nome do produto e o valor
    if(nome == '' || valor == '' || isNaN(valor)){
        res.redirect("/falhaEdicao");
    } else {

    // definir o tipo de edição
    try {
        // objeto de imagem
        let imagem = req.files.imagem;
        // sql
        let sql = `UPDATE produtos SET nome = '${nome}', valor = ${valor}, imagem = '${imagem.name}' WHERE codigo = ${codigo}`;
        // executar comando sql 
        conexao.query(sql, (erro, resultado) => {
            if (erro) throw erro;
            // Remover imagem antiga
            fs.unlink(__dirname + '/images/' + nomeImagem, (erro_imagem) => {
                if (erro_imagem) console.log("Imagem deu ERRO!");
            })
            // cadastrar nova imagem
            imagem.mv(__dirname + '/images/' + imagem.name);
        });


    } catch (erro) {
        // sql
        let sql = `UPDATE produtos SET nome = '${nome}', valor = ${valor} WHERE codigo = ${codigo}`;
        // executar comando sql 
        conexao.query(sql, (erro, resultado) => {
            // caso funcione
            if (erro) throw erro;
        });
    }
    // Finalizar rota
    res.redirect("/okEdicao");
    }
});
// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});