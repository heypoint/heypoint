import { APP_ID, Injector, NgModule }                                                            from "@angular/core";
import { Analytics, getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from "@angular/fire/analytics";
import { FirebaseApp, initializeApp, provideFirebaseApp }                                        from "@angular/fire/app";
import { AppCheck, initializeAppCheck, provideAppCheck }                                         from "@angular/fire/app-check";
import { Auth, getAuth, provideAuth }                                                            from "@angular/fire/auth";
import { Firestore, getFirestore, provideFirestore }                                             from "@angular/fire/firestore";
import { Functions, getFunctions, provideFunctions }                                             from "@angular/fire/functions";
import { ReactiveFormsModule }                                                                   from "@angular/forms";
import { BrowserModule }                                                                         from "@angular/platform-browser";
import { BrowserAnimationsModule }                                                               from "@angular/platform-browser/animations";
import { RouterModule }                                                                          from "@angular/router";
import { APP_ENVIRONMENT, GIT_INFO, PACKAGE_VERSION }                                            from "@heypoint/injection-tokens";
import { AppCheckOptionsService }                                                                from "@heypoint/services";
import { TransferHttpCacheModule }                                                               from "@nguniversal/common";
import { gitInfo }                                                                               from "../../../.git-info";
import { packageVersion }                                                                        from "../../../.package-version";
import { environment }                                                                           from "../../../environment";
import { RootComponent }                                                                         from "../../components";


@NgModule({
  bootstrap:    [
    RootComponent,
  ],
  declarations: [
    RootComponent,
  ],
  imports:      [
    BrowserAnimationsModule,
    BrowserModule,
    provideAnalytics(
      (): Analytics => getAnalytics(),
    ),
    provideAppCheck(
      (injector: Injector): AppCheck => initializeAppCheck(
        undefined,
        injector.get(AppCheckOptionsService).appCheckOptions(),
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
    ReactiveFormsModule,
    RouterModule.forRoot(
      [
        {
          loadComponent: () => import("@heypoint/components").then(
            (m) => m.HomeRouteComponent,
          ),
          path:          "",
          pathMatch:     "full",
          title:         "Heypoint",
        },
        {
          loadComponent: () => import("@heypoint/components").then(
            (m) => m.OtherwiseRouteComponent,
          ),
          path:          "**",
          title:         "Heypoint | Page not found",
        },
      ],
      {
        initialNavigation:         "enabledBlocking",
        scrollPositionRestoration: "enabled",
      },
    ),
    TransferHttpCacheModule,
  ],
  providers:    [
    ScreenTrackingService,
    UserTrackingService,
    {
      provide:  APP_ID,
      useValue: "serverApp",
    },
    {
      provide:  APP_ENVIRONMENT,
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