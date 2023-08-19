const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
const sqlite3 = require("sqlite3");
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("SERVER is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`SERVER ERROR:${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};
//API1
app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", priority, status } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query): //if this is true then below query is taken in the code
      getTodosQuery = `
                            SELECT
                                *
                            FROM
                                todo 
                            WHERE
                                todo LIKE '%${search_q}%'
                                AND status = '${status}'
                                AND priority = '${priority}';`;
      break;
    case hasPriorityProperty(request.query):
      getTodosQuery = `
                                SELECT
                                    *
                                FROM
                                    todo 
                                WHERE
                                    todo LIKE '%${search_q}%'
                                    AND priority = '${priority}';`;
      break;
    case hasStatusProperty(request.query):
      getTodosQuery = `
                SELECT
                    *
                FROM
                    todo 
                WHERE
                    todo LIKE '%${search_q}%'
                    AND status = '${status}';`;
      break;
    default:
      getTodosQuery = `
                SELECT
                    *
                FROM
                    todo 
                WHERE
                    todo LIKE '%${search_q}%';`;
  }

  data = await database.all(getTodosQuery);
  response.send(data);
});
