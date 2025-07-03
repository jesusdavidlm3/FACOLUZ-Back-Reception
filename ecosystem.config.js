module.exports = {
  apps: [{
    name: "Reception",
    script: "deno run -A --watch main.ts",
    args: "run dev",
    interpreter: "deno", // Esto es importante para que PM2 no intente usar Node
    watch: true, // Opcional: reinicia la app cuando hay cambios
  }]
}