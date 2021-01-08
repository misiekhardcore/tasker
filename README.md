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
