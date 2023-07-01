
# What is it?

Kaupax is a platform that allows individuals who want to sell their apartment to conveniently compare service fees from local real estate agents.

# More detailed

The user has the ability to list their apartment, specifying keydetails such as the street address, city, and surface area. Realtors can then make bids, detailing their service fees. The user also has access to information about each realtor, such as their experience and track record.

Currently, the code is at the Minimum Viable Product (MVP) stage. The goal is not to create a fully functional product but to leave it as is, since the project is not something I am passionate about.

Both clients and realtors have their own front ends.

The backend is written in Node, and the demo site that is online uses AWS RDS Postgresql DB. Both front-ends are written using Next/React and MUI.

The project was built in a month, working on weekends and on free time after a normal day job.
 
# Tech

- TypeScript
- React
- Next
- MapBox API
- Google Maps API
- Google Geocoding API
- AWS: EC2, IAM, S3, RDS, SES
- Node
- Prisma
- MUI
- JWT for Auth (also had google OAuth previously)

# Features

- Clients can post listings
- Realtors can bid on listings
- Users can accept bids
- Chat for realtors and clients
- Auth
- Map, clusters on map, geocoding from address to lat/long coordinates.
- Usable on mobile
- Emails/Notifications
- AWS S3 storage for listings pictures
- Backend auto-deployment on commits via github workflows and containers

# Running locally

At present, it is not practical to provide a comprehensive guide on running this locally due to the requirement of multiple API keys and some AWS configuration for proper functionality.
