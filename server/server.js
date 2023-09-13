import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';
import { ClientError } from './lib/client-error';


// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

// Create paths for static directories
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/workouts', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "workouts"
        order by "date",
                 "workoutTitle",
                 "workoutNotes";
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/workouts', async(req, res, next) => {
  console.log(req.body);
  const userId = 1;
  try {
    const { date, workoutTitle, workoutNotes } = req.body;
    if (!date || !workoutTitle || !workoutNotes || !userId) {
      throw new ClientError(400, 'task and isCompleted are required');
    }
    const sql = `
      insert into "workouts" ("workoutDate", "workoutTitle", "workoutNotes", "userId")
        values ($1, $2, $3, $4)
        returning *
    `;

    const workoutParams = [date, workoutTitle, workoutNotes, userId];
    const result = await db.query(sql, workoutParams)
    const [workout] = result.rows
    res.status(201).json(workout)
    } catch (err) {
    next(err);
  }
});
;

app.patch('/api/workouts/:workoutId', async (req, res, next) => {
  try {
    const workoutId = Number(req.params.workoutId);
    if (!Number.isInteger(workoutId) || workoutId < 1) {
      throw new ClientError(400, 'workoutId must be a positive integer');
    }
    const { isCompleted } = req.body;
    if (typeof isCompleted !== 'boolean') {
      throw new ClientError(400, 'isCompleted (boolean) is required');
    }
    const sql = `
      update "todos"
        set "updatedAt" = now(),
            "isCompleted" = $1
        where "todoId" = $2
        returning *
    `;
    const params = [isCompleted, todoId];
    const result = await db.query(sql, params);
    const [todo] = result.rows;
    if (!todo) {
      throw new ClientError(404, `cannot find todo with todoId ${todoId}`);
    }
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

/**
 * Serves React's index.html if no api route matches.
 *
 * Implementation note:
 * When the final project is deployed, this Express server becomes responsible
 * for serving the React files. (In development, the Create React App server does this.)
 * When navigating in the client, if the user refreshes the page, the browser will send
 * the URL to this Express server instead of to React Router.
 * Catching everything that doesn't match a route and serving index.html allows
 * React Router to manage the routing.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
