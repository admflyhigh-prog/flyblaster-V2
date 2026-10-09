#!/usr/bin/env bash
# Fly Blaster - seed demo data via API
set -e

BASE="http://localhost:8091/api"
TOKEN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"admin@flyblaster.local","password":"admin123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))")

AUTH="Authorization: Bearer $TOKEN"
JSON="Content-Type: application/json"

echo "=== create group ==="
GRP=$(curl -s -X POST "$BASE/groups" -H "$AUTH" -H "$JSON" -d '{"name":"SPM Trial 2026 - Parents"}')
echo "$GRP"
GRPID=$(echo "$GRP" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "=== add contacts to group ==="
curl -s -X POST "$BASE/groups/$GRPID/contacts" -H "$AUTH" -H "$JSON" -d '{
  "contacts": [
    {"name":"Ahmad bin Ali","phone":"+60123456789"},
    {"name":"Siti Nurhaliza","phone":"+60129876543"},
    {"name":"Wong Wei Lun","phone":"+60134567890"},
    {"name":"Rajeswari Devi","phone":"+60187654321"},
    {"name":"Lim Mei Ling","phone":"+60198765432"}
  ]
}' | python3 -m json.tool

echo "=== create template ==="
TPL=$(curl -s -X POST "$BASE/templates" -H "$AUTH" -H "$JSON" -d '{
  "name":"Exam Reminder",
  "message_text":"Dear {name|student|parent}, your SPM trial exam is this Friday. Please prepare.",
  "channel":"whatsapp"
}')
echo "$TPL"
TPLID=$(echo "$TPL" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "=== create campaign ==="
curl -s -X POST "$BASE/campaigns" -H "$AUTH" -H "$JSON" -d "{
  \"name\":\"March SPM Blast\",
  \"groupIds\":[$GRPID],
  \"templateId\":$TPLID,
  \"channel\":\"whatsapp\",
  \"delaySeconds\":2
}" | python3 -m json.tool

echo "=== sync snapshot ==="
curl -s "$BASE/sync" -H "$AUTH" | python3 -c "
import sys,json
d=json.load(sys.stdin)
print('groups:', len(d['groups']))
print('contacts:', len(d['contacts']))
print('templates:', len(d['templates']))
print('campaigns:', len(d['campaigns']))
print('dailyStats:', d['dailyStats'])
print('totalStats:', d['totalStats'])
"
