import { defineConfig, type Options } from 'tsup';

type WatchableOptions = Options & {
  watch?: boolean;
};

export default defineConfig((options: WatchableOptions): Options[] => {
  const isWatch = Boolean(options.watch);

  const baseConfig: Options = {
    entry: {
      index: 'src/index.ts',
    },
    outDir: 'dist',
    format: ['esm', 'cjs'],
    target: 'node18',
    dts: {
      entry: 'src/index.ts',
      resolve: true,
    },
    sourcemap: true,
    clean: !isWatch,
    minify: false,
    treeshake: 'recommended',
    splitting: false,
    bundle: true,
    skipNodeModulesBundle: true,
    platform: 'node',
    shims: false,
    outExtension: (): Record<string, string> => ({
      js: '.js',
    }),
  };

  return [baseConfig];
});
