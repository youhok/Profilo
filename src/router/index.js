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

    // Production: hide backend routes from unauthenticated users entirely
    let resolved = false;
    const stop = onAuthStateChanged(auth, (user) => {
        if (resolved) return;
        resolved = true;
        stop();
        if (!user && isBackendRoute) return next({ path: "/" });
        if (guestOnly && user) return next({ path: "/dashboard" });
        if (requiresAuth && !user) return next({ path: "/login" });
        return next();
    });
});

export default router;
