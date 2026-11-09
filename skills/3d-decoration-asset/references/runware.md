# Runware adapter

Current docs, worth a look when the CLI behaves differently from this page:

- https://runware.ai/docs/tools/cli
- https://runware.ai/docs/models-api/authentication
- https://runware.ai/docs/models-api/pricing

## Setup

Run this once per machine. Every command here is free.

1. Install the official single-binary CLI after the user agrees. On macOS that is `brew install --cask runware/tap/runware`; other platforms are in the CLI docs. Inference needs only `run`, so the `serverless` commands stay unused.

2. Authenticate. The CLI reads `RUNWARE_API_KEY` from the environment, and that variable overrides any stored key. Keep the key in the machine's secret store and export it into the shell; the user types the key, and the agent works only with the variable. Without a secret store, the user runs `runware auth login` in their own terminal. `runware auth status` and `runware account details` print a key prefix, so their output stays out of files, logs and commits.

3. Check. Done when `runware auth status` says valid and `runware ping` says ok. `runware account details` shows the remaining balance.

## Per run

1. Find a model. `runware model search --search "<task>"` returns models by name or AIR identifier; text searches mix in community LoRAs, so judge results by their AIR prefix. Then read `runware model show <air>`, `runware model schema <air>`, `runware model examples <air>` and `runware model pricing <air>`. Pricing lists a price per configuration, for example geometry only, textured or PBR for 3D models.

2. Record the AIR, configuration, price, input and output formats and license in the manifest before the first run.

3. Pass a local reference with `runware media upload <file> -F json`, which returns a `mediaUUID`. Put it in the image field the model's schema names.

4. Run with `runware run <air> key=value ... --validate --output-dir <dir outside the repo>`. `--validate` checks the parameters against the schema before submission. Without `--output-dir`, results land in `./outputs` under the current directory. Runs are async by default; when one is interrupted, `runware result <taskUUID>` resumes it without submitting it again.

5. Download accepted files right away, since generated media URLs expire. Commit only the optimized web files.

## REST fallback

When the CLI is missing, send `POST https://api.runware.ai/v1` with a JSON array body and `Authorization: Bearer $RUNWARE_API_KEY`. Each task object carries its task type, a UUID v4 `taskUUID`, a model AIR and the fields from the model's schema. Long tasks finish asynchronously, so poll until the result arrives and report a task as done only once its output exists.
