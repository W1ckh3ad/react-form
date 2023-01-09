import {
  Outlet,
  RouterProvider,
  createReactRouter,
  createRouteConfig,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { HarderExample } from "./examples/typescript-not-working";
import { SimpleExample } from "./examples/simple";

const rootRoute = createRouteConfig({
  component: () => {
    return (
      <>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <Link
            to="/simple"
            activeProps={{
              className: "font-bold",
            }}
          >
            SimpleForm
          </Link>
          <Link
            to="/harder"
            activeProps={{
              className: "font-bold",
            }}
          >
            Header form
          </Link>
        </div>
        <hr />
        <Outlet />
        {/* Start rendering router matches */}
        <TanStackRouterDevtools position="bottom-right" />
      </>
    );
  },
});

const indexRoute = rootRoute.createRoute({
  path: "/",
  component: () => {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    );
  },
});

const simpleFormRoute = rootRoute.createRoute({
  path: "simple",

  component: () => {
    return (
      <div className="p-2 flex gap-2">
        <hr />
        <SimpleExample />
      </div>
    );
  },
  errorComponent: () => "Oh crap",
});

const harderFormRoute = rootRoute.createRoute({
  path: "harder",
  

  component: () => {
    return (
      <div className="p-2 flex gap-2">
        <hr />
        <HarderExample />
      </div>
    );
  },
  errorComponent: () => "Oh crap",
});

const routeConfig = rootRoute.addChildren([
  indexRoute,
  simpleFormRoute,
  harderFormRoute,
]);

// Set up a ReactRouter instance
const router = createReactRouter({
  routeConfig,
  defaultPreload: "intent",
});

// Register your router for typesafety
declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}

export default () => <RouterProvider router={router} />;
