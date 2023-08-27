import { isPlatformBrowser }                                                           from "@angular/common";
import { Inject, Injectable, PLATFORM_ID }                                             from "@angular/core";
import { AppCheckOptions, AppCheckToken, CustomProvider, ReCaptchaEnterpriseProvider } from "@angular/fire/app-check";
import { ENVIRONMENT }                                                                 from "@heypoint/injection-tokens";
import { Environment }                                                                 from "@heypoint/interfaces";


@Injectable({
  providedIn: "root",
})
export class AppCheckOptionsService {

  public readonly appCheckOptions: AppCheckOptions;

  constructor(
    @Inject(ENVIRONMENT) private readonly appEnvironment: Environment,
    @Inject(PLATFORM_ID)     private readonly platformId:     object,
  ) {
    this
      .appCheckOptions = isPlatformBrowser(platformId) ? {
        isTokenAutoRefreshEnabled: true,
        provider:                  new ReCaptchaEnterpriseProvider(appEnvironment.recaptchaKeyID),
      } : {
        isTokenAutoRefreshEnabled: false,
        provider:                  new CustomProvider(
          {
            getToken: (): Promise<AppCheckToken> => Promise.resolve(
              {
                token:            process.env["APP_CHECK_TOKEN_" + appEnvironment.app.toUpperCase()] as string,
                expireTimeMillis: Date.now(),
              },
            ),
          },
        ),
      };
  }

}
