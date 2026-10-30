import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({ OPENWEATHER_API_KEY: { static: true } });
