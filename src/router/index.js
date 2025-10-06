// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

import Login from "../components/auth/Login.vue";
import Register from "../components/auth/Register.vue";
import Dashboard from "../components/backend/Dashboard.vue";
import Projects from "../components/backend/Projects.vue";
import BackendSkills from "../components/backend/Skills.vue";
import AdminLayout from "../components/backend/layouts/AdminLayout.vue";
import Settings from "../components/backend/Settings.vue";

const routes = [
    // Public alias to ensure login is reachable even if backend meta changes
    { path: "/auth/login", name: "PublicLogin", component: Login, meta: { isBackend: true, guestOnly: true } },
    { path: "/login", name: "Login", component: Login, meta: { isBackend: true, guestOnly: true } },
    { path: "/register", name: "Register", component: Register, meta: { isBackend: true, guestOnly: true } },
    {
        path: "/dashboard",
        component: AdminLayout,
        meta: { isBackend: true, requiresAuth: true },
        children: [
            { path: "", name: "Dashboard", component: Dashboard },
            { path: "projects", name: "Projects", component: Projects },
            { path: "skills", name: "BackendSkills", component: BackendSkills },
            { path: "settings", name: "Settings", component: Settings },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition;
        return { left: 0, top: 0 };
    },
});

// Hide backend routes on production unless authenticated
router.beforeEach((to, _from, next) => {
    const isBackendRoute = to.meta && to.meta.isBackend;
    const requiresAuth = to.meta && to.meta.requiresAuth;
    const guestOnly = to.meta && to.meta.guestOnly;
    const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

    // Public routes
    if (!isBackendRoute) return next();

    // In development allow access; still redirect logged-in guests appropriately
    const proceedWithAuthCheck = () => {
        let resolved = false;
        const stop = onAuthStateChanged(auth, (user) => {
            if (resolved) return;
            resolved = true;
            stop();

            if (requiresAuth && !user) return next({ path: "/login" });
            if (guestOnly && user) return next({ path: "/dashboard" });
            return next();
        });
    };

    if (isDev) return proceedWithAuthCheck();

    // Production: allow guest routes, hide protected backend pages from unauthenticated users
    let resolved = false;
    const stop = onAuthStateChanged(auth, (user) => {
        if (resolved) return;
        resolved = true;
        stop();
        // If already logged in, keep them away from guest-only pages (login/register)
        if (guestOnly && user) return next({ path: "/dashboard" });
        // If not logged in and the route is guest-only (e.g., /login, /register), allow
        if (!user && isBackendRoute && guestOnly) return next();
        // If not logged in and trying to access protected backend pages, send to login
        if (!user && isBackendRoute && requiresAuth) return next({ path: "/login" });
        // Allow access to any other backend routes that don't require auth (none currently)
        return next();
    });
});

export default router;
