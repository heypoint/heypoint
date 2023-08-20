import { isPlatformBrowser }                                                           from "@angular/common";
import { Inject, Injectable, PLATFORM_ID }                                             from "@angular/core";
import { AppCheckOptions, AppCheckToken, CustomProvider, ReCaptchaEnterpriseProvider } from "@angular/fire/app-check";
import { APP_ENVIRONMENT }                                                             from "@heypoint/injection-tokens";
import { AppEnvironment }                                                              from "@heypoint/interfaces";


@Injectable({
  providedIn: "root",
})
export class AppCheckOptionsService {

  public readonly appCheckOptions: AppCheckOptions;

  constructor(
    @Inject(APP_ENVIRONMENT) private readonly appEnvironment: AppEnvironment,
    @Inject(PLATFORM_ID)     private readonly platformId:     object,
  ) {
    this
      .appCheckOptions = isPlatformBrowser(platformId) ? {
        isTokenAutoRefreshEnabled: true,
        provider:                  new ReCaptchaEnterpriseProvider(appEnvironment.recaptchaSiteKey),
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
