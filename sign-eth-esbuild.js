import esbuild from 'esbuild'

esbuild.build({
    entryPoints: ["./src/sign-eth-tx.js"], // Add more files as needed
    outfile: "build/sign-eth-tx.js",
    bundle: true,
    external: ['./node_modules/*'],
    format: "esm", // or "cjs" for CommonJS
    platform: 'node',
    target: "esnext", // or "es6" depending on compatibility needs
}).then(() => {
    console.log("Build complete!");
}).catch(() => process.exit(1));
