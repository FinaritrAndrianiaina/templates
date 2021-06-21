# SaaS

![database diagram](diagram.png)

- A `User` can be associated with one `Account` where they can invite other users.
- The `Account` table holds data about the plan type, subscription info and invites.
- The `Invite` table holds data for invites: when they were created and the receiver's email.