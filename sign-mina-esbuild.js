import esbuild from 'esbuild'

esbuild.build({
    entryPoints: ["./src/sign-mina-tx.js"], // Add more files as needed
    outfile: "build/sign-mina-tx.js",
    format: "esm", // or "cjs" for CommonJS
    bundle: true,
    external: ['./node_modules/*'],
    platform: 'node',
    target: "esnext", // or "es6" depending on compatibility needs
}).then(() => {
    console.log("Build complete!");
}).catch(() => process.exit(1));
