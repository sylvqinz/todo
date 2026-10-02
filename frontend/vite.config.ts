import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// Configuration Vite avec les plugins React et Tailwind CSS
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'SENTRY_')
  const hasSentryBuildConfig = Boolean(
    env.SENTRY_AUTH_TOKEN && env.SENTRY_ORG && env.SENTRY_PROJECT,
  )

  return {
    build: {
      sourcemap: hasSentryBuildConfig ? 'hidden' : false,
    },
    plugins: [
      react(),
      tailwindcss(),
      hasSentryBuildConfig &&
        sentryVitePlugin({
          authToken: env.SENTRY_AUTH_TOKEN,
          org: env.SENTRY_ORG,
          project: env.SENTRY_PROJECT,
        }),
    ],
  }
})
