# Basic Login Page

A sign-up and log-in flow that lets a person create an Account, start a Session, and end it again.

## Language

**Account**:
The record created at Sign up, made of a name, an email, and a password.
_Avoid_: User, profile, member

**Visitor**:
A person using the app without an active Session.
_Avoid_: Guest, anonymous user

**Session**:
The state of being logged in as exactly one Account.
_Avoid_: Login (as a noun), auth state

**Sign up**:
Creating a new Account.
_Avoid_: Register, create account, join

**Log in**:
Starting a Session for an existing Account.
_Avoid_: Sign in, authenticate

**Log out**:
Ending the current Session.
_Avoid_: Sign out, log off

**Sign-up success page**:
The page shown once, right after Sign up, confirming the Account was created; it does not start a Session.
_Avoid_: Confirmation page, welcome page

**Home**:
The page shown only while a Session is active, greeting the Account by name.
_Avoid_: Dashboard, landing page
