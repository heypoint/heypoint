import { NgModule }         from "@angular/core";
import { ServerModule }     from "@angular/platform-server";
import { AppBrowserModule } from "./app.browser.module";
import { RootComponent }    from "../../components";


@NgModule({
  imports: [
    AppBrowserModule,
    ServerModule,
  ],
  bootstrap: [
    RootComponent,
  ],
  providers: []
})
export class AppServerModule {}
