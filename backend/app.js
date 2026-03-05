// importar express
const express = require("express");



// importar express-handlebars
const { engine } = require("express-handlebars");

// importar express-fileupload
const fileupload = require("express-fileupload");

// importar módulos
const rota_produtos = require("./rotas/produtos_rota");

// app
const app = express();

// Adicionar css
app.use('/css', express.static("./css"));

// Adicionar imagens
app.use('/images', express.static("./images"));

// configurar express-handlebars
app.engine("handlebars", engine({
    helpers: {
      // Função auxiliar para verificar igualdade
      condicionalIgualdade: function (parametro1, parametro2, options) {
        return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
      }
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./views");

// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// NOVO: Ativar o express-fileupload
app.use(fileupload());

// usar rotas
app.use("/", rota_produtos);

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});