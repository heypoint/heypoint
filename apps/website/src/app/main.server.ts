import { enableProdMode }  from "@angular/core";
import { AppServerModule } from "./modules";
import { environment }     from "../environment";


environment
  .production && enableProdMode();

export { AppServerModule };
