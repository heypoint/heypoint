import { BreakpointObserver, BreakpointState }             from "@angular/cdk/layout";
import { DOCUMENT, isPlatformBrowser }                     from "@angular/common";
import { Inject, Injectable, PLATFORM_ID, signal, Signal } from "@angular/core";
import { toSignal }                                        from "@angular/core/rxjs-interop";
import { distinctUntilChanged, fromEvent, map, startWith } from "rxjs";


type ColorScheme = "light" | "dark";

@Injectable({
  providedIn: "root",
})
export class ResponsivityService {

  public readonly colorScheme$:    Signal<ColorScheme>;
  public readonly scrollPosition$: Signal<number>;

  constructor(
    @Inject(DOCUMENT)    document:   Document,
    @Inject(PLATFORM_ID) platformId: object,

    private readonly breakpointObserver: BreakpointObserver,
  ) {
    this
      .colorScheme$ = isPlatformBrowser(platformId) ? toSignal<ColorScheme>(
        breakpointObserver.observe("(prefers-color-scheme: light)").pipe<ColorScheme, ColorScheme>(
          map<BreakpointState, ColorScheme>((breakpointState: BreakpointState): ColorScheme => breakpointState.matches ? "light" : "dark"),
          distinctUntilChanged<ColorScheme>(),
        ),
        {
          requireSync: true,
        },
      ) : signal<ColorScheme>("light");
    this
      .scrollPosition$ = isPlatformBrowser(platformId) ? toSignal<number>(
        fromEvent<Event>(
          document,
          "scroll",
        ).pipe<number, number, number>(
          map<Event, number>((): number => document.defaultView?.scrollY || 0),
          startWith<number>(document.defaultView?.scrollY || 0),
          distinctUntilChanged<number>(),
        ),
        {
          requireSync: true,
        },
      ) : signal<number>(0);
  }

}
