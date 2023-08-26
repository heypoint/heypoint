import { APP_BASE_HREF }   from "@angular/common";
import { enableProdMode }  from "@angular/core";
import { ngExpressEngine } from "@nguniversal/express-engine";
import * as express        from "express";
import { existsSync }      from "fs";
import { join }            from "path";
import { environment }     from "../environment";
import { AppServerModule } from "./modules";
import "zone.js/dist/zone-node";


environment
  .production && enableProdMode();

export const app: () => express.Express = (): express.Express => {
  const server: express.Express = express();
  const distFolder = join(
    process.cwd(),
    "dist/apps/website/browser",
  );
  const indexHtml = existsSync(
    join(
      distFolder,
      "index.original.html",
    ),
  ) ? "index.original.html" : "index";

  server
    .engine(
      "html",
      ngExpressEngine(
        {
          bootstrap: AppServerModule,
        },
      ),
    );
  server
    .set(
      "view engine",
      "html",
    );
  server
    .set(
      "views",
      distFolder,
    );
  server
    .get(
      "*.*",
      express.static(
        distFolder,
        {
          maxAge: "1y",
        },
      ),
    );
  server
    .get(
      "*",
      (req, res): void => res.render(
        indexHtml,
        {
          req,
          res,
          providers: [
            {
              provide:  APP_BASE_HREF,
              useValue: req.baseUrl,
            },
          ],
        },
        (error: Error, html?: string) => res.send(html).end(),
      ),
    );

  return server;
}

const run: () => void = (): void => {
  const port: string | 4000 = process
    .env["PORT"] || 4000;
  const server: express.Express = app();

  server
    .listen(
      port,
      (): void => console.log(`Node Express server listening on http://localhost:${port}`),
    );
}

declare const __non_webpack_require__: NodeRequire;
const mainModule: NodeJS.Module | undefined = __non_webpack_require__
  .main;
const moduleFilename: string = mainModule && mainModule
  .filename || "";
(moduleFilename === __filename || moduleFilename.includes("iisnode")) && run();

export { AppServerModule };
