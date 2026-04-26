
Copiar

const express = require("express");
const router = express.Router();
const moment = require("moment");
moment.locale('pt-br');
//requisição o Models
//usar chaves para envolver o objeto
const { tarefasModel } = require("../models/tarefasModel");
const { body, validationResult } = require("express-validator");
 
 
router.get("/", async (req, res) => {
    res.locals.moment = moment;
    try {
        const lista = await tarefasModel.findAll();
        // console.table(lista);
        res.render("pages/index", { "linhasTabela": lista });
 
    } catch (error) {
        console.log(error);
    }
 
 
});
 
 
router.get("/nova-tarefa", (req, res) => {
    res.locals.moment = moment;
    res.render("pages/cadastro", {
        tarefa:{id_tarefa:"",nome_tarefa:"",prazo_tarefa:"",
            situacao_tarefa:1,status:1},
        tituloAba: "Nova Tarefa",
        tituloPagina: "Inserção de Tarefa", id_tarefa: "0"
    });
})
 
router.get("/editar", async (req, res) => {
    res.locals.moment = moment;
    const id = req.query.id;
    try {
        const dadosTarefa = await tarefasModel.findById(id);
        console.log(dadosTarefa[0]); 
        res.render("pages/cadastro", {
            tarefa:dadosTarefa[0],
            tituloAba: "Edição de Tarefa",
            tituloPagina: "Alteração de Tarefa", id_tarefa: id
        });
    } catch (erro) {
        console.log(erro)
    }
 
})
 
 
 
router.post("/nova-tarefa",
    // adicionar o express validator
    // nome -> 5 a 45 caracteres
    // prazo data válida (hoje ou futuro)
    // situação inteiro de 0 a 4
    [
        body("tarefa")
            .trim()
            .isLength({ min: 5, max: 45 })
            .withMessage("O nome da tarefa deve ter entre 5 e 45 caracteres."),
 
        body("prazo")
            .notEmpty()
            .withMessage("O prazo é obrigatório.")
            .isDate({ format: "YYYY-MM-DD" })
            .withMessage("O prazo deve ser uma data válida.")
            .custom((value) => {
                const hoje = moment().startOf("day");
                const prazo = moment(value, "YYYY-MM-DD", true).startOf("day");
                if (!prazo.isValid()) {
                    throw new Error("Data inválida.");
                }
                if (prazo.isBefore(hoje)) {
                    throw new Error("O prazo deve ser hoje ou uma data futura.");
                }
                return true;
            }),
 
        body("situacao")
            .isInt({ min: 0, max: 4 })
            .withMessage("A situação deve ser um número inteiro entre 0 e 4.")
    ],
    async (req, res) => {
        res.locals.moment = moment;
 
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/cadastro", {
                tarefa: {
                    id_tarefa: "",
                    nome_tarefa: req.body.tarefa,
                    prazo_tarefa: req.body.prazo,
                    situacao_tarefa: req.body.situacao,
                    status: 1
                },
                tituloAba: "Nova Tarefa",
                tituloPagina: "Inserção de Tarefa",
                id_tarefa: "0",
                erros: erros.array()
            });
        }
 
        let dadosInsert = {
            nome: req.body.tarefa,
            prazo: req.body.prazo,
            situacao: req.body.situacao
        }
 
        try {
            const insert = await tarefasModel.create(dadosInsert);
            console.log(insert);
            res.redirect("/");
        } catch (erro) {
            console.log(erro);
        }
    }
)
 
router.get("/teste-create", async (req, res) => {
 
    let dadosInsert = {
        nome: "remover virus do PC 2 do 2B",
        prazo: "2026-04-10"
    }
    try {
        const resultInsert =
            await tarefasModel.create(dadosInsert);
 
        console.log(resultInsert);
        res.send("insert realizado");
    } catch (erro) {
        console.log(erro);
    }
 
});
 
router.get("/teste-delete", async (req, res) => {
    // let codigo = 4;
    // try{
    //     const resultDelete = 
    //         await pool.query("delete from tarefas where id_tarefa = ? ", [codigo]); 
 
    //      console.log(resultDelete);
    //      res.send("Delete físico realizado");       
    // }catch(erro){
    //     console.log(erro);
    // }
 
});
 
router.get("/teste-delete-logico", async (req, res) => {
    // let codigo = 6;
    // try{
    //     const resultDelete = 
    //         await pool.query("update tarefas set status_tarefa = 0 where id_tarefa = ? ", [codigo]); 
 
    //      console.log(resultDelete);
    //      res.send("Delete físico realizado");       
    // }catch(erro){
    //     console.log(erro);
    // }
 
});
 
 
 
 
module.exports = router;