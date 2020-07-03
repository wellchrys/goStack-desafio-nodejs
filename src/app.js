const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {
    title,
    url,
    techs
  } = request.body

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.status(200).json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const {
    title,
    url,
    techs,
    likes
  } = request.body

  if(likes)
    return response.status(400).json({ likes: 0 })

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if (repoIndex < 0)
    return response.status(400).json({ error: 'Repository not found' })


  const like = repositories[repoIndex].likes

  const repo = {
    id,
    title,
    url,
    techs,
    likes: like
  }
  
  repositories[repoIndex] = repo

  return response.status(200).json(repositories[repoIndex])

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if (repoIndex < 0)
    return response.status(400).json({ error: 'Repository not found' })

  repositories.splice(repoIndex, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const findRepository = repositories.find(repo => 
    repo.id === id
  );

  if (!findRepository)
    return response.status(400).json({ error: 'Repository does not exists.' });

  findRepository.likes += 1;

  return response.json(findRepository);

});

module.exports = app;
