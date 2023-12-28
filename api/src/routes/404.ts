import { NotFoundHandler } from "hono";

export const handle404: NotFoundHandler = (c) => {
  const CURRENT_URL = c.req.url;

  return c.html(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.min.css"
    />
  </head>
  <body>
    <main>
      <h1>It looks like you got lost</h1>
      <p>
        If this is a problem, open an issue at
        <a href="https://github.com/KennanHunter/scouting/issues"
          >the github page</a
        >
        or contact <code>Kennnan</code> on Discord.
      </p>
      <p>
        current request url: 
        <a href="${CURRENT_URL}">${CURRENT_URL}</a>
      </p>
    </main>
  </body>
</html>`,
    404
  );
};
