// importar mysql2
const mysql = require("mysql2");

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

// exportar conexão
module.exports = conexao;