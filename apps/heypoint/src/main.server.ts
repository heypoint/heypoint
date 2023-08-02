import { enableProdMode }  from "@angular/core";
import { AppServerModule } from "./app/modules";
import { environment }     from "./environment";


environment
  .production && enableProdMode();

export { AppServerModule };
