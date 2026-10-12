"""Explicit server-owner bootstrap; never exposed over HTTP."""
import argparse
import os

from order_store import OrderStore

parser = argparse.ArgumentParser()
parser.add_argument("command", choices=["bootstrap-admin"])
parser.add_argument("--login", required=True)
parser.add_argument("--database", default=os.getenv("SPEC_DATABASE"))
args = parser.parse_args()
if not args.database:
    parser.error("--database is required")
store = OrderStore(args.database)
print("Administrator assigned: " + store.admin.bootstrap_admin(args.login))
