import esbuild from 'esbuild'
const files = [
    {
        entryPoints: ['./src/sign-admin-set-config.js'],
        outfile: 'build/sign-admin-set-config.js'
    },
    {
        entryPoints: ['./src/sign-user-lock-tx.js'],
        outfile: 'build/sign-user-lock-tx.js'
    },
    {
        entryPoints: ['./src/sign-mina-tx.js'],
        outfile: 'build/sign-mina-tx.js'
    },
    {
        entryPoints: ['./src/sign-eth-tx.js'],
        outfile: 'build/sign-eth-tx.js'
    }]
await Promise.all(files.map(f => esbuild.build({
    ...f,
    format: "esm", // or "cjs" for CommonJS
    bundle: true,
    external: ['./node_modules/*'],
    platform: 'node',
    target: "esnext", // or "es6" depending on compatibility needs
}).then(() => {
    console.log("Builds complete!");
}).catch(() => process.exit(1))
))