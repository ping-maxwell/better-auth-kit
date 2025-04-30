This folder is for testing the Better-Auth-Kit CLI.

To run, you do **not** need to be in the `testing` directory.
Make sure you're on the the `CLI` project root directory, and run:

```bash
bun start
```

If you want to run Better-auth migration command, make sure to CD into this `testings` direcotry,
then run:

> NOTE: This will overwrite the DB entirely.

```bash
npx @better-auth/cli@latest migrate --config ./testing/auth.ts && mv -f ../test.db ./test.db
```