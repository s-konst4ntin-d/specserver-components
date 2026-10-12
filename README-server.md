# Ubuntu Server Snapshot

The root website files, `assets/`, `admin/` and Python modules are copied from the
deployed Ubuntu release `20260903-220727`. They include the storefront, catalog,
administration interface and backend for accounts and orders.

Production databases, environment files, credentials, customer uploads and bundled
third-party Python packages are not included. Keep runtime data outside this checkout.

Use Python 3.10 or newer, install `requirements-admin.txt` into a virtual environment,
then run `server.py` with the required environment configuration. Set `SPEC_DATABASE`
to a persistent database outside the checkout. The default HTTP port is 8080.
The existing production service configuration is not included in this snapshot.

GitHub Pages serves the static storefront only. Accounts, orders and administration
require the Python backend; publishing files on Pages does not deploy that backend.
The copied Python deployment does not require the older npm build tooling.
