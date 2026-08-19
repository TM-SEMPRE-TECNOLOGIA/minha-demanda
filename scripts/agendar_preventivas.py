import os, json, datetime, urllib.request, ssl, time

TOKEN_PATH = os.path.expandvars(r'C:\Users\thiag\.config\google-calendar-mcp\tokens.json')
CRED_PATH = os.path.expandvars(r'C:\Users\thiag\Desktop\gcp-oauth.keys.json')

with open(TOKEN_PATH, 'r') as f:
    token_data = json.load(f)

creds = token_data.get('personal', token_data)
access_token = creds.get('access_token')
refresh_token = creds.get('refresh_token')
expiry_date = creds.get('expiry_date', 0)

with open(CRED_PATH) as f:
    creds_file = json.load(f)
installed = creds_file.get('installed', creds_file)
client_id = installed.get('client_id')
client_secret = installed.get('client_secret')

now_ms = int(time.time() * 1000)
if expiry_date and expiry_date < now_ms:
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
    creds['access_token'] = access_token
    creds['expiry_date'] = int(time.time() * 1000) + int(new_token.get('expires_in', 3600)) * 1000
    token_data['personal'] = creds
    with open(TOKEN_PATH, 'w') as f:
        json.dump(token_data, f, indent=2)

ctx = ssl.create_default_context()
tomorrow = datetime.date.today() + datetime.timedelta(days=1)

# --- EVENT 1: Dom Aquino + São Félix (09:30-10:30) ---
e1_start = datetime.datetime(tomorrow.year, tomorrow.month, tomorrow.day, 9, 30, 0)
e1_end = datetime.datetime(tomorrow.year, tomorrow.month, tomorrow.day, 10, 30, 0)

event1 = {
    'summary': '🏗️ Preventivos: Dom Aquino + São Félix do Araguaia',
    'description': (
        '📍 DOM AQUINO (2 novos)\n'
        '  ☐ Corrigir relatórios\n'
        '  ☐ Enviar para aprovação\n\n'
        '📍 SÃO FÉLIX DO ARAGUAIA (2 novos)\n'
        '  ☐ Corrigir relatórios\n'
        '  ☐ Enviar para aprovação'
    ),
    'start': {'dateTime': e1_start.isoformat(), 'timeZone': 'America/Sao_Paulo'},
    'end': {'dateTime': e1_end.isoformat(), 'timeZone': 'America/Sao_Paulo'},
    'reminders': {'useDefault': False, 'overrides': [
        {'method': 'popup', 'minutes': 30},
        {'method': 'popup', 'minutes': 10},
    ]},
    'colorId': '5'  # Yellow
}

# --- EVENT 2: Areado + Arenápolis (10:30-11:30) ---
e2_start = datetime.datetime(tomorrow.year, tomorrow.month, tomorrow.day, 10, 30, 0)
e2_end = datetime.datetime(tomorrow.year, tomorrow.month, tomorrow.day, 11, 30, 0)

event2 = {
    'summary': '🏗️ Preventivos: Areado + Arenápolis',
    'description': (
        '📍 AREADO\n'
        '  ☐ Corrigir relatórios\n'
        '  ☐ Enviar para aprovação\n\n'
        '📍 ARENÁPOLIS\n'
        '  ☐ Corrigir relatórios\n'
        '  ☐ Enviar para aprovação'
    ),
    'start': {'dateTime': e2_start.isoformat(), 'timeZone': 'America/Sao_Paulo'},
    'end': {'dateTime': e2_end.isoformat(), 'timeZone': 'America/Sao_Paulo'},
    'reminders': {'useDefault': False, 'overrides': [
        {'method': 'popup', 'minutes': 30},
        {'method': 'popup', 'minutes': 10},
    ]},
    'colorId': '5'  # Yellow
}

# --- EVENT 3: Tabaporã (Sábado 19/07 09:00-10:00) ---
saturday = tomorrow + datetime.timedelta(days=1)
e3_start = datetime.datetime(saturday.year, saturday.month, saturday.day, 9, 0, 0)
e3_end = datetime.datetime(saturday.year, saturday.month, saturday.day, 10, 0, 0)

event3 = {
    'summary': '🏗️ Preventivo: Tabaporã (Sábado)',
    'description': (
        '📍 TABAPORÃ\n'
        '  ☐ Realizar preventivo\n'
        '  ☐ Registrar relatório fotográfico\n'
        '  ☐ Enviar para aprovação'
    ),
    'start': {'dateTime': e3_start.isoformat(), 'timeZone': 'America/Sao_Paulo'},
    'end': {'dateTime': e3_end.isoformat(), 'timeZone': 'America/Sao_Paulo'},
    'reminders': {'useDefault': False, 'overrides': [
        {'method': 'popup', 'minutes': 60},
        {'method': 'popup', 'minutes': 15},
    ]},
    'colorId': '6'  # Orange (sábado = diferente)
}

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

def create_event(event, label):
    event_data = json.dumps(event).encode('utf-8')
    req = urllib.request.Request(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        data=event_data, headers=headers)
    resp = urllib.request.urlopen(req, context=ctx)
    created = json.loads(resp.read())
    print(f"✅ {label}: {created.get('htmlLink', 'OK')}")

create_event(event1, "Dom Aquino + São Félix (09:30)")
create_event(event2, "Areado + Arenápolis (10:30)")
create_event(event3, "Tabaporã Sábado (09:00)")
print("\n🎯 TODOS OS EVENTOS CRIADOS!")
