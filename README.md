I. PROJECT OVERVIEW

Key user of this app is event admins who will be able to perform these tasks:
  - Register new event attendant
  - Generate a Qr code for individual attendant 
  - Sendemail to the attendant with the Qrcode
  - Scan QrCode with mobile phone and checkin/checkout attendants
  - Manage list of attendants and manually sent/resent email to attendants, checkin/checkout or delete attendants
The second beneficiary of this app is event attendants who will be able to:
  - Receive invitation email together with an embedded Qrcode
  - Confirm their participation to the event by following the link in the email


II. TECHNOLOGIES
1. Backend & Database:
  - Nodejs, Express, Restful API
  - npm package: qrcode
  - sendgrid

2. Database:
    MongoDB, Mongoose

3. Frontend
    React, Redux, Redux Thunk
    React Router

4. Styling:
   Bootstrap, React Bootstrap

NOTICE:
For security reason, the email service will be disabled in public repository. However, the database will still be updated when users choose the send email to attendants.


