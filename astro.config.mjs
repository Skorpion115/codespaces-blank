import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import preact from "@astrojs/preact";

// Middleware function to handle cookies
const cookieMiddleware = (req, res, next) => {
    cookieParser()(req, res, () => {
        if (!req.cookies.userConsent) {
            // Set a default cookie if not present with SameSite=None and Secure attributes
            res.cookie('userConsent', 'false', {
                maxAge: 900000,
                httpOnly: true,
                sameSite: 'None',
                secure: true
            });
        }
        next();
    });
};


// https://astro.build/config
export default defineConfig({
    prefetch: true,
    server: {
        port: 4321,
        host: true,
        middleware: [
            cookieMiddleware
        ]
    },

    devToolbar: {
        enabled: false,
    },

    build: {
        format: "directory", // Erzeugt `page/index.html` statt `page.html`
        sourcemap: true, // Aktiviert Source Maps in Vite
        chunkSizeWarningLimit: 3420 // Setze hier deine bevorzugte Grenze ein
    },

    publicDir: "public",

    output: "server", // SSR serverseitiges Rendern
    adapter: netlify({
        functionPerRoute: true,
    }),

    integrations: [
        preact({
            include: ["**/preact/*"],
        }),
    ],
    trailingSlash: "always",
    markdown: {
        drafts: true,
        mode: "md",
    },

});
