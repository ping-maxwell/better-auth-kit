# Steps to creating a new component

1. Head into `/registry/new-york`.
2. Create folder `<your_component>` with a new file with the same as your folder name but with `.tsx` extension.
3. Write your component code within, making sure that local imports are using path aliases (`@/`).
4. Once finished, head to `registry.json`, and add a new component in there.
5. Head over to the `docs` app, and modify the `package.json` to include a new script named `ui:<your_component>`,
and use the same script code as all of the other previous `ui:...` scripts, just modified for your case.
6. Using your terminal, making sure you're in the `ui` package, run `bun run build`.
7. Then `cd` over to the `docs` app, and run `bun run ui:<your_component>`
8. Push to github. Then the better-auth-kit registry would be automatically updated.