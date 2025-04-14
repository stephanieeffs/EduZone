type Environment = "development" | "staging" | "production";

interface Env {
  VITE_API_BASE_URL: string;
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
  VITE_APP_ENV: Environment;
  VITE_APP_DEBUG: boolean;
}

function getEnvVar(key: keyof Env): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

function getEnvVarWithDefault<T>(key: keyof Env, defaultValue: T): T {
  const value = import.meta.env[key];
  return value ? (value as T) : defaultValue;
}

const currentEnv = getEnvVarWithDefault<Environment>(
  "VITE_APP_ENV",
  "development"
);

export const env = {
  apiBaseUrl: getEnvVar("VITE_API_BASE_URL"),
  appName: getEnvVar("VITE_APP_NAME"),
  appVersion: getEnvVar("VITE_APP_VERSION"),
  appEnv: currentEnv,
  isDebug: getEnvVarWithDefault("VITE_APP_DEBUG", false),
  isDevelopment: currentEnv === "development",
  isStaging: currentEnv === "staging",
  isProduction: currentEnv === "production",
} as const;
