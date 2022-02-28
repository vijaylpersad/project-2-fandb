# FANDB
---
## Overview
- A multi-user application for soccer fans to save and track their favorite teams and leagues
---
## Wireframes
---
## RESTful Routes
---
| Verb: | Url Pattern: | Action(CRUD): | Description |
| ----- | ------------ | ------------- | -------------------------------------  |
| GET   |   /teams     |  Show/read    | List query results from team search form | 
| GET   |   /teams/:id |  Show/read    | Reveal team record, squad, etc. |
| PUT   |   /teams/:id |  Update       | Save team to profile, replace save button with delete|
| GET   |   /leagues     |  Show/read    | List query results from league search form | 
| GET   |   /leagues/:id |  Show/read    | Reveal league standings |
| PUT   |   /leagues/:id |  Update       | Save league to profile, replace save button with delete|
| GET   |   /profile   |  Show/read    | Show user favorite teams & leagues |
| DELETE|   /profile   |  Destroy      | Delete a user favorite |
| PUT   |   /profile   |  Update       | Add a team/league to user favorites list (from /x/:id) |
## API
---
## Models
---
## MVP
---
- User login/logout
- Home button
- Profile Button
- /profile displays user favorite teams and leagues
- Home displays search forms for leagues and teams
- Results displays list of teams or leagues user can click into for details 
- User can add/delete teams/leagues to profile favorites

## Stretch Goals
---
## References
