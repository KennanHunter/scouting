import { D1Database } from "@cloudflare/workers-types";
import { Context, Handler, Hono, MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { addTrailingSlash } from "./middleware/addTrailingSlash";
import { handle404 } from "./routes/404";
import { generateHandler } from "./routes/auth/generate";
import { dumpHandler } from "./routes/dump";
import { dumpScheduleHandler } from "./routes/dumpSchedule";
import { graphqlHandler } from "./routes/graphql";
import { graphqlViewerHandler } from "./routes/graphql/viewer";
import { TBAWebhookHandler } from "./webhooks/tba";
import { dumpTeamsHandler } from "./routes/dumpTeams";

export type Bindings = {
  DB: D1Database;
  TBA_KEY: string;
  TBA_SECRET: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();
export type RouteHandler<P extends string = any> = Handler<
  { Bindings: Bindings },
  P
>;
export type Middleware = MiddlewareHandler<{ Bindings: Bindings }>;

export type APIContext = Context<{ Bindings: Bindings }>;

app
  .notFound(handle404)
  .use("/*", addTrailingSlash)
  .use("/*", cors()) // TODO: limit cors allowed origins
  // .use("/api/*", protect) // TODO: Fix Authentication
  .post("/auth/generate/", generateHandler)
  .get("/dump/schedule/:eventId/:format/", dumpScheduleHandler)
  .get("/dump/teams/:eventId/:format/", dumpTeamsHandler)
  .get("/dump/:eventId/:format/", dumpHandler)
  .get("/viewer/", graphqlViewerHandler)
  .post("/webhooks/tba", TBAWebhookHandler)
  .use("/graphql/", graphqlHandler);

export default app;
