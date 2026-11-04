import { loadEnv } from 'vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/';

  if (!base.startsWith('/') || !base.endsWith('/')) {
    throw new Error('VITE_BASE_PATH must start and end with a slash.');
  }

  return {
    base,
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          login: 'login/index.html',
          register: 'register/index.html',
        },
      },
    },
  };
};
