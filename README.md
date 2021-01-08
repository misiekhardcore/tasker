## User

### Mutations

- login(username,password) - checks for a user in database and returs user data and auth token
- register(username,email,password,confirmPassword,key) - register new user checking if there is no other with the same name and email. Given key is either license key and it creates admin account or it is user key from admin to register new users within a team

## Tables

### Queries

- getTables - return all tables where user is in a team and can at least read
- getTable(tableId) - return table with given ID if user is in team and can at least read

### Mutation

- createTable(title,descrition,team) - create new table if you are logged in

## Tasks

### Queries

- getTask(tableId,taskId) - return task with given ID within a given table if user have permissions

### Mutations

- createTask(tableId, title, description) - create new task in given table if user have permission
