import { Context, Handler, Hono, MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { addTrailingSlash } from "./middleware/addTrailingSlash";
import { handle404 } from "./routes/404";
import { generateHandler } from "./routes/auth/generate";
import { graphqlHandler } from "./routes/graphql";
import { graphqlViewerHandler } from "./routes/graphql/viewer";

export type Bindings = {
  DB: D1Database;
  TBA_KEY: string;
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
  .get("/viewer/", graphqlViewerHandler)
  .use("/graphql/", graphqlHandler);

export default app;
