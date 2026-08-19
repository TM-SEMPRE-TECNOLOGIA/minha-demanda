import os, json, datetime, urllib.request, urllib.parse, ssl, time, base64

TOKEN_PATH = os.path.expandvars(r'C:\Users\thiag\.config\google-calendar-mcp\tokens.json')
CRED_PATH = os.path.expandvars(r'C:\Users\thiag\Desktop\gcp-oauth.keys.json')

with open(TOKEN_PATH, 'r') as f:
    token_data = json.load(f)

# MCP token format: 'personal' key with OAuth fields
creds = token_data.get('personal', token_data)

access_token = creds.get('access_token')
refresh_token = creds.get('refresh_token')
expiry_date = creds.get('expiry_date', 0)

# Read client_id/secret from credentials file
with open(CRED_PATH) as f:
    creds_file = json.load(f)
installed = creds_file.get('installed', creds_file)
client_id = installed.get('client_id')
client_secret = installed.get('client_secret')

# Check expiry (millisecond timestamp)
now_ms = int(time.time() * 1000)
if expiry_date and expiry_date < now_ms:
    print("Token expirado. Renovando...")
    data = urllib.parse.urlencode({
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token',
    }).encode()
    req = urllib.request.Request('https://oauth2.googleapis.com/token', data=data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'})
    resp = urllib.request.urlopen(req)
    new_token = json.loads(resp.read())
    access_token = new_token['access_token']
    # Update token file
    creds['access_token'] = access_token
    creds['expiry_date'] = int(time.time() * 1000) + int(new_token.get('expires_in', 3600)) * 1000
    token_data['personal'] = creds
    with open(TOKEN_PATH, 'w') as f:
        json.dump(token_data, f, indent=2)
    print("Token renovado e salvo!")
else:
    remaining = (expiry_date - now_ms) / 1000 / 60 if expiry_date else 0
    print(f"Token válido. Expira em {remaining:.0f} minutos.")

ctx = ssl.create_default_context()

# 1. List calendars
req = urllib.request.Request('https://www.googleapis.com/calendar/v3/users/me/calendarList',
    headers={'Authorization': f'Bearer {access_token}'})
resp = urllib.request.urlopen(req, context=ctx)
calendars = json.loads(resp.read())
print("\n=== CALENDÁRIOS ===")
for c in calendars.get('items', []):
    primary = " (PRIMARY)" if c.get('primary') else ""
    print(f"  [{c['id']}] {c['summary']}{primary}")

# 2. Create event for tomorrow at 09:30
tomorrow = datetime.date.today() + datetime.timedelta(days=1)
start_dt = datetime.datetime(tomorrow.year, tomorrow.month, tomorrow.day, 9, 30, 0)
end_dt = start_dt + datetime.timedelta(hours=2)

print(f"\n=== CRIANDO EVENTO ===")
print(f"📅 {start_dt.strftime('%d/%m/%Y')} 09:30 - 11:30")
print(f"📌 Preventivas TM - Relatórios Fotográficos")
print(f"🔔 Alarmes: 30min e 10min antes")

event = {
    'summary': '🔧 Preventivas TM - Relatórios Fotográficos',
    'description': 'Realizar preventivas agendadas: relatórios fotográficos de vistoria.',
    'start': {
        'dateTime': start_dt.isoformat(),
        'timeZone': 'America/Sao_Paulo',
    },
    'end': {
        'dateTime': end_dt.isoformat(),
        'timeZone': 'America/Sao_Paulo',
    },
    'reminders': {
        'useDefault': False,
        'overrides': [
            {'method': 'popup', 'minutes': 30},
            {'method': 'popup', 'minutes': 10},
        ],
    },
}

event_data = json.dumps(event).encode('utf-8')
req = urllib.request.Request(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    data=event_data,
    headers={
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    })
resp = urllib.request.urlopen(req, context=ctx)
created = json.loads(resp.read())
print(f"\n✅ EVENTO CRIADO COM SUCESSO!")
print(f"   ID: {created['id']}")
print(f"   Link: {created.get('htmlLink', 'N/A')}")
