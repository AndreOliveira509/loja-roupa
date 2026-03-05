// Importar o módulo de conexão com banco MySQL
const conexao = require('../bd/conexao_mysql');

// Importar o módulo file system
const fs = require('fs');

// Função para exibir o formulário para cadastro de produtos
function formularioCadastro(req, res){
    res.render("formulario");
}

// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){
    res.render("formulario", { situacao: req.params.situacao });
}

// Função para exibir o formulário para edição de produtos
function formularioEditar(req, res){
    // sql
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;
    // executar comando sql 
    conexao.query(sql, (erro, retorno) => {
        // Caso haja falha no comando
        if (erro) throw erro;
        // Caso funcione
        res.render("formularioEditar", { produto: retorno[0] });
    })
}

// Função para exibir a listagem de produtos
function listagemProdutos(req, res){
    let categoria = req.params.categoria;
    let sql = "";
    
    if(categoria == "todos"){
        sql = "SELECT * FROM produtos";
    } else {
        sql = `SELECT * FROM produtos WHERE categoria = '${categoria}'`;
    }

    conexao.query(sql, (erro, resultado) => {
        if (erro) throw erro;
        res.render("lista", { produtos: resultado, situacao: `Categoria: ${categoria}` });
    });
}

// Função para realizar a pesquisa de produtos
function pesquisa(req, res){
    // Obter o termo pesquisado
    let termo = req.body.termo;
    // Sql
    let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`;
    // executar comando sql 
    conexao.query(sql, (erro, resultado) => {
        let semResgistros = resultado.length == 0 ? true : false;

        res.render("lista", { produtos: resultado, semResgistros: semResgistros});
    });
}

// Função para realizar o cadastro de produtos
function cadastrarProduto(req, res){
    try{
     // 1. Pega os dados
    let nome = req.body.nome;
    let valor = req.body.valor;
    let categoria = req.body.categoria;
    let imagem = req.files.imagem.name;

    // validar o nome do produto e o valor
    if(nome == '' || valor == '' || isNaN(valor) || categoria == ''){
        res.redirect("/falhaCadastro");
    }else{
        // 2. Monta o SQL
        let sql = `INSERT INTO produtos (nome, valor, categoria, imagem) VALUES ('${nome}', ${valor}, '${categoria}', '${imagem}')`;

        // 3. Executa no banco e salva a foto
        conexao.query(sql, (erro, resultado) => {
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
}

// Função para realizar a remoção de produtos
function removerProduto(req, res){
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
}

// Função responsável pela edição de produtos
function editarProduto(req, res){
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
}

// Exportar funções
module.exports = {
    formularioCadastro,
    formularioCadastroComSituacao,
    formularioEditar,
    listagemProdutos,
    pesquisa,
    cadastrarProduto,
    removerProduto,
    editarProduto
};

