<div align="center"><h1>stem-tetris</h1></div>
<div align="center">Tetris leaderboard for the STEM Team</div>

## Getting started
This project runs on GCP, so to run it locally you will need the `gcloud` CLI with the Datastore emulator installed. Also, to build the app, you will need `webpack`, `webpack-dev-server`, and of course `node` installed.

Then:
```shell
# Clone the repo...
git clone https://github.com/MKA-Stem/stem-tetris.git
cd stem-tetris

# ... Then start the app.
yarn dev-db &     # Start the database in the background
yarn dev-client & # Start webpack-dev-server in the background
yarn dev-server & # Start the API server in the background
```

## GCP 
To deploy to GCP manually, run `yarn build` before `gcloud app deploy`. This builds the static frontend.

This project has Travis set up, so any successful Travis build will push to GCP with `client-secret.json` for authentication.
