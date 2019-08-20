const express = require("express");
const app = express();

//seta json body nas requests
app.use(express.json());

let contaReq = 0;
//mock 
const projetos = [
  {
    id: 1,
    title: "Novo projeto",
    tasks: []
  },
  {
    id: 2,
    title: "Outro projeto",
    tasks: ["Tarefa"]
  }
];

/**
 * Middleware que conta número de requisições realizadas
 */
app.use((req, res, next) => {
  console.log(`Requisições realidas: ${++contaReq}`);
  return next();
});

const checkIdExists = (req, res, next) => {
  const projeto = projetos.find(p => p.id === parseInt(req.params.id));
  if (!projeto) {
    res.status(404).json({ error: "Project with id specified not found!" });
  }

  req.projeto = projeto;

  return next();
};

app.get("/projects", (req, res) => {
  return res.json(projetos);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projetos.push({ id, title, tasks: [] });

  return res.json(projetos);
});

app.put("/projects/:id", checkIdExists, (req, res) => {
  const { title } = req.body;

  const projeto = req.projeto;

  projeto.title = title;

  return res.json(projetos);
});

app.delete("/projects/:id", checkIdExists, (req, res) => {

  const index = req.projeto;

  projetos.splice(index, 1);

  return res.send();
});

app.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { title } = req.body;

  const projeto = req.projeto;

  projeto.tasks.push(title);

  return res.json(projetos);
});

app.listen(3000);
