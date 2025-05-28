I want to add a functionality to my business-dashboard.html that allows me to add a new appointment when the button is clicked.
Load all services in my dropdown from api https://ffandauimebhkbfoxidc.supabase.co/rest/v1/services?select=*
Here is the reference payload: [
  {
    "service_id": 23,
    "business_id": 10,
    "name": "Swedish Massage",
    "duration": 60,
    "price": 85.00,
    "description": "Relaxing full-body massage using long, flowing strokes to reduce tension and improve circulation.",
    "active": true,
    "created_at": "2025-05-09T20:19:56.207108+00:00",
    "updated_at": "2025-05-09T20:19:56.207108+00:00"
  },...]
Load clients in my dropdown from api https://ffandauimebhkbfoxidc.supabase.co/rest/v1/clients?select=*
Here is the reference payload: [
  {
    "client_id": 11,
    "first_name": "Emma",
    "last_name": "Johnson",
    "email": "emma.johnson@example.com",
    "phone": "555-111-2222",
    "notes": "Prefers afternoon appointments",
    "created_at": "2025-05-09T20:21:03.64385+00:00",
    "updated_at": "2025-05-09T20:21:03.64385+00:00"
  },...]

I will POST the form info to  https://appointment-scheduler-backend-zyhu.onrender.com/appointments

My api post payload is expecting service_id, client_id, date and start_time
