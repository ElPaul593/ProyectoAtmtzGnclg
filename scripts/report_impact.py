#!/usr/bin/env python3
"""Generate impact report from Supabase appointments.

Requires environment variables:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

Outputs:
- reports/impact_report.csv
- reports/impact_report.json
"""

from __future__ import annotations

import csv
import json
import os
import sys
from collections import defaultdict
from datetime import datetime
from urllib import request
from urllib.error import HTTPError

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

REPORT_DIR = os.path.join(os.path.dirname(__file__), "..", "reports")
CSV_PATH = os.path.join(REPORT_DIR, "impact_report.csv")
JSON_PATH = os.path.join(REPORT_DIR, "impact_report.json")


def require_env() -> None:
    missing = []
    if not SUPABASE_URL:
        missing.append("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL")
    if not SUPABASE_KEY:
        missing.append("SUPABASE_SERVICE_ROLE_KEY")
    if missing:
        raise RuntimeError(
            "Missing required environment variables: " + ", ".join(missing)
        )


def supabase_get(path: str) -> list[dict]:
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    req = request.Request(url)
    req.add_header("apikey", SUPABASE_KEY)
    req.add_header("Authorization", f"Bearer {SUPABASE_KEY}")
    try:
        with request.urlopen(req) as response:
            data = response.read().decode("utf-8")
            return json.loads(data)
    except HTTPError as exc:
        raise RuntimeError(f"Supabase request failed: {exc.code} {exc.reason}") from exc


def build_service_lookup() -> dict[str, dict]:
    services = supabase_get("services?select=id,name,price_usd")
    return {service["id"]: service for service in services}


def fetch_appointments() -> list[dict]:
    return supabase_get(
        "appointments?select=id,service_id,status,start_at,created_at"
    )


def summarize(appointments: list[dict], services: dict[str, dict]) -> dict:
    daily = defaultdict(lambda: {
        "total": 0,
        "confirmed": 0,
        "pending": 0,
        "awaiting_transfer": 0,
        "cancelled": 0,
        "revenue_usd": 0.0,
    })

    for appointment in appointments:
        date = appointment["start_at"].split("T")[0]
        status = appointment["status"]
        daily[date]["total"] += 1

        if status == "CONFIRMED":
            daily[date]["confirmed"] += 1
            service = services.get(appointment["service_id"])
            if service and service.get("price_usd") is not None:
                daily[date]["revenue_usd"] += float(service["price_usd"])
        elif status == "PENDING":
            daily[date]["pending"] += 1
        elif status == "AWAITING_TRANSFER":
            daily[date]["awaiting_transfer"] += 1
        elif status == "CANCELLED":
            daily[date]["cancelled"] += 1

    summary = []
    for date, metrics in sorted(daily.items()):
        summary.append({"date": date, **metrics})

    total_confirmed = sum(item["confirmed"] for item in summary)
    total_revenue = sum(item["revenue_usd"] for item in summary)

    return {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "total_days": len(summary),
        "total_confirmed": total_confirmed,
        "total_revenue_usd": round(total_revenue, 2),
        "daily": summary,
    }


def write_outputs(report: dict) -> None:
    os.makedirs(REPORT_DIR, exist_ok=True)

    with open(CSV_PATH, "w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(
            csv_file,
            fieldnames=[
                "date",
                "total",
                "confirmed",
                "pending",
                "awaiting_transfer",
                "cancelled",
                "revenue_usd",
            ],
        )
        writer.writeheader()
        for row in report["daily"]:
            writer.writerow(row)

    with open(JSON_PATH, "w", encoding="utf-8") as json_file:
        json.dump(report, json_file, indent=2, ensure_ascii=False)


def main() -> int:
    try:
        require_env()
        services = build_service_lookup()
        appointments = fetch_appointments()
        report = summarize(appointments, services)
        write_outputs(report)
        print(f"Report generated: {CSV_PATH}")
        print(f"Report generated: {JSON_PATH}")
        return 0
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
