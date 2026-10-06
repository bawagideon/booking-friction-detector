# Integration & Deployment Guide: Booking Friction Detector

## 1. Calendar & EHR Ingress
* **Calendar Providers:** Direct integration with Google Calendar API, Cal.com, Calendly, and Acuity Scheduling.
* **Practice Management / EHR APIs:** JaneApp, Dentrix, Nextech, and Mindbody webhook ingestion.
* **Mobile Verification:** SMS one-time pin (OTP) or magic confirmation link via Twilio Verify.

## 2. Environment Configuration
```env
PORT=3007
CALENDAR_PROVIDER=google
GOOGLE_CALENDAR_ID=primary
TWILIO_ACCOUNT_SID=AC_live_xxx
TWILIO_VERIFY_SERVICE_SID=VA_xxx
SLACK_NOTIFY_WEBHOOK=https://hooks.slack.com/services/xxx
```

## 3. Resilience & Invariants
* **Double-Booking Prevention:** Locks calendar slot for 10 minutes during active user checkout.
* **Network Interruption:** LocalStorage preserves selected date/time during page reloads.
