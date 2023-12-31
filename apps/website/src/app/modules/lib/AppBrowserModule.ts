import { APP_BASE_HREF }                                                                         from "@angular/common";
import { Injector, NgModule }                                                                    from "@angular/core";
import { Analytics, getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from "@angular/fire/analytics";
import { FirebaseApp, initializeApp, provideFirebaseApp }                                        from "@angular/fire/app";
import { AppCheck, initializeAppCheck, provideAppCheck }                                         from "@angular/fire/app-check";
import { Auth, getAuth, provideAuth }                                                            from "@angular/fire/auth";
import { Firestore, getFirestore, provideFirestore }                                             from "@angular/fire/firestore";
import { Functions, getFunctions, provideFunctions }                                             from "@angular/fire/functions";
import { MatSidenavModule }                                                                      from "@angular/material/sidenav";
import { BrowserModule, provideClientHydration }                                                 from "@angular/platform-browser";
import { BrowserAnimationsModule }                                                               from "@angular/platform-browser/animations";
import { RouterModule }                                                                          from "@angular/router";
import { ProfileCardsComponent, InfoCardsComponent }                                             from "@heypoint/components";
import { ENVIRONMENT, GIT_INFO, PACKAGE_VERSION }                                                from "@heypoint/injection-tokens";
import { AppCheckOptionsService }                                                                from "@heypoint/services";
import { TransferHttpCacheModule }                                                               from "@nguniversal/common";
import { gitInfo }                                                                               from "../../../.git-info";
import { packageVersion }                                                                        from "../../../.package-version";
import { environment }                                                                           from "../../../environment";
import { RootComponent, routes }                                                                 from "../../components";


@NgModule({
  bootstrap:    [
    RootComponent,
  ],
  declarations: [
    RootComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatSidenavModule,
    provideAnalytics(
      (): Analytics => getAnalytics(),
    ),
    provideAppCheck(
      (injector: Injector): AppCheck => initializeAppCheck(
        undefined,
        injector.get(AppCheckOptionsService).appCheckOptions,
      ),
    ),
    provideAuth(
      (): Auth => getAuth(),
    ),
    provideFirebaseApp(
      (): FirebaseApp => initializeApp(environment.firebase),
    ),
    provideFirestore(
      (): Firestore => getFirestore(),
    ),
    provideFunctions(
      (): Functions => getFunctions(),
    ),
    RouterModule.forRoot(
      routes,
      {
        initialNavigation:         "enabledBlocking",
        scrollPositionRestoration: "enabled",
      },
    ),
    TransferHttpCacheModule,
    ProfileCardsComponent,
    InfoCardsComponent,
  ],
  providers:    [
    provideClientHydration(),
    ScreenTrackingService,
    UserTrackingService,
    {
      provide: APP_BASE_HREF,
      useValue: "/",
    },
    {
      provide:  ENVIRONMENT,
      useValue: environment,
    },
    {
      provide:  GIT_INFO,
      useValue: gitInfo,
    },
    {
      provide:  PACKAGE_VERSION,
      useValue: packageVersion,
    },
  ],
})
export class AppBrowserModule {
}
