# Disclaimer: This is a demo app only. Use as a reference only!

1. Clone the repo

2. Go to project root directory and from the command line, run command "npm install"

3. Create certificate (along with private key)
   https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm

4. Create connected app with digital certificate

- Callback: https://localhost:8443/oauth/callback

  - Use digital certificate checkbox and upload above certificate
  - Scopes

    - Access your basic information (id, profile, email, address, phone)
    - Access and manage your data (api)
    - Provide access to your data via the Web (web)
    - Allow access to your unique identifier (openid)

  - Note down the consumer key and consumer secret for later.

  - Make sure to set... Permitted Users - "Admin approved users are pre authorised". Add the required profiles e.g. Sys Admin
    IP Relaxation - "Relax UP restrictions"

4. Update your `.env` file

5. Replace the server.key under lib directory of the project

## Run Locally

- Once you have the above setup correctly, you can run by running `heroku local` and then browse to http://localhost:8443/

- Click "Client Admin Login" and login using client org's Sys Admin user
- App will fetch and display client salesforce org's users
- Client org's Sys Admin user will select the users that he/she wish to grant partner to callback using API later on.
- Partner stored the information of client org's instanceURL and user names in order to call back using JWT mechanism.

## Upload the app to Heroku as a new app

Go to heroku.com and create a new app and that should give you instructions on how to push your code e.g.

git init
heroku git:remote -a yourappname
git add .
git commit -am "Initial checkin"
git push heroku master
