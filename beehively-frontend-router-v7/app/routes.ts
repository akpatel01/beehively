import { type RouteConfig, layout, index, route } from "@react-router/dev/routes";

export default [
    layout("components/Layout.tsx", [
        index("routes/home.tsx"),
        route("login", "routes/login.tsx"),
        route("signup", "routes/signup.tsx"),
        route("profile", "routes/profile.tsx"),
        route("create-post", "routes/create-post.tsx"),
        route("content/:id", "routes/content.tsx"),
        route("users/:id", "routes/users.tsx"),
    ]),
    route("*", "routes/notfound.tsx"),
] satisfies RouteConfig;
