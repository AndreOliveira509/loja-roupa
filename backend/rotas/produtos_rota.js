// Importar o módulo express
const express = require('express');

// Extraíndo a função Router do módulo express
const router = express.Router();

// Importar módulo de serviços
const servico = require('../servicos/produtos_servico');

// Rota Principal
router.get("/", (req, res) => {  
    servico.formularioCadastro(req, res);
});

// Rota Principal contendo a situação
router.get("/:situacao", (req, res) => {
    servico.formularioCadastroComSituacao(req, res);
});

// Rota para listar produtos por categoria
router.get("/categoria/:categoria", (req, res) => {
    servico.listagemProdutos(req, res);
});
// Rota para pesquisa
router.post("/pesquisa", function(req, res){
    servico.pesquisa(req, res);
});
// Rota de cadastro enxuta!
router.post("/cadastrar", (req, res) => {
   servico.cadastrarProduto(req, res);
});

// rota de delete
router.get("/deletar/:codigo&:imagem", (req, res) => {
    servico.removerProduto(req, res);
});

// Rota para redirecionar para o formulário de edição
router.get("/formularioEditar/:codigo", (req, res) => {
    servico.formularioEditar(req, res);
});

// Rota para editar produtos
router.post("/editar", (req, res) => {
    servico.editarProduto(req, res);
});

// Exportar o router
module.exports = router;

