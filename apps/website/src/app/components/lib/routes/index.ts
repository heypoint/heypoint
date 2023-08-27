import { Route } from "@angular/router";


export const routes: Route[] = [
  {
    loadComponent: () => import("./lib/home/HomeRouteComponent").then(
      (module) => module.HomeRouteComponent,
    ),
    path:          "",
    pathMatch:     "full",
    title:         "Heypoint",
    data:          {
      description: "Heypoint is a work in progress.",
    },
  },
  {
    loadComponent: () => import("./lib/otherwise/OtherwiseRouteComponent").then(
      (module) => module.OtherwiseRouteComponent,
    ),
    path:          "**",
    title:         "Heypoint | Page not found",
    data:          {
      description: "This page was not found.",
    },
  },
];
