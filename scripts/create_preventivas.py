import os, json, datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/calendar']
TOKEN_PATH = os.path.expandvars(r'C:\Users\thiag\.config\google-calendar-mcp\tokens.json')
CRED_PATH = os.path.expandvars(r'C:\Users\thiag\Desktop\gcp-oauth.keys.json')

# Load token from MCP's token file
with open(TOKEN_PATH, 'r') as f:
    token_data = json.load(f)

# Get the personal account token
creds_data = token_data.get('personal', token_data)
creds = Credentials.from_authorized_user_info(creds_data, SCOPES)

if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(CRED_PATH, SCOPES)
        creds = flow.run_local_server(port=0)
    # Save
    with open(TOKEN_PATH, 'w') as f:
        json.dump({'personal': json.loads(creds.to_json())}, f)

service = build('calendar', 'v3', credentials=creds)

# List calendars
cal_list = service.calendarList().list().execute()
print("=== CALENDÁRIOS ===")
for c in cal_list.get('items', []):
    print(f"  {c['summary']} (id: {c['id']})")

# Create event for TOMORROW at 09:30 BRT
tomorrow = datetime.date.today() + datetime.timedelta(days=1)
start_dt = datetime.datetime(tomorrow.year, tomorrow.month, tomorrow.day, 9, 30, 0)
end_dt = start_dt + datetime.timedelta(hours=2)

print(f"\n=== CRIANDO EVENTO ===")
print(f"Data: {start_dt.strftime('%d/%m/%Y')} às 09:30")

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

created = service.events().insert(calendarId='primary', body=event).execute()
print(f"✅ Evento criado: {created.get('htmlLink')}")
print(f"   ID: {created['id']}")
print(f"   Alarme: 30min e 10min antes via popup")
