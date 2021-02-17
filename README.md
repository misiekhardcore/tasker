# Tasker - task managing app

Tasker is an app created to manage folders and tasks within these folders. Every folder and task has its own name, descrition and group of users. Additionally tasks can be also commented. Descriptions supports MarkDown.

Frontend app is deployed to [Netlify](https://tasker-task.netlify.app/)
and backend is running on [Heroku](https://tasker-task.herokuapp.com).

You can log in with `user@user.com` password `user` to play with it

## Frontend

Frontend is a `React` application with `Apollo client` to communicate with backend easily.

`Styled-components` with `polished` are used to set dynamic styling for most elements in app with some global styling running on `scss`

## Backend

Dedicated server based on Apollo server. Database with MongoDB and GraphQL for data requests.

### User

#### Mutations

- `login(username,password)` - checks for a **User** in database and returs **User** data and auth **token**
- `register(username,email,password,confirmPassword,key)` - register new **User** checking if there is no other with the same name and email. Given key is either license key and it creates admin account or it is **User** key from admin to register new users within a **Team**

### Tables

#### Queries

- `getTables(parent)` - return all **Tables** which parent is given. Returns only those **Tables** where you are in a **Group**.
- `getTable(tableId)` - return **Table** with given ID if **User** is in **Group**.

#### Mutation

- `createTable(parent,name,descrition)` - create new **Table** if you are logged in. Creates also **Group** for this **Table** containing all **Users** from parent **Table**.
- `updateTable(tableId,name,description,parent)` - updates **Table** with a given ID with a given data.
- `deleteTable(tableId)` - removes **Table** from database. Deletes also all _subtables_, _subtasks_ and all connected _subinfo_.

### Tasks

#### Queries

- `getTasks(parent)` - return all **Tasks** which parent is given. Returns only those **Tables** where you are in a **Group**.
- `getTask(taskId)` - return **Task** with given ID if **User** is in a **Group**.

#### Mutations

- `createTask(parent, name, description,status)` - create new **Task** in given **Table** if **User** have permission. Creates also **Group** for this **Table** containing all **Users** from parent **Table**.
- `updateTask(taskId,name,description,status,parent)` - updates **Task** with a given ID with a given data.
- `deleteTask(taskId)` - removes **Task** from database. Deletes also **Comments** and **Group**.

### Comments

#### Queries

- `getComments(parent)` - returns all **Comments** for a parent **Task**.
- `getComment(commentId)` - returns **Comment** with a given ID.

#### Mutations

- `createComment(parent,body)` - creates new **Comment** for a given **Task**.
- `deleteComment(commentId)` - removes **Comment** from database if **User** is creator.

### Team

#### Queries

- `getTeam(teamId)` - returns **Team** with a given ID. Returns only if **User** is a member of the **Team**.

### Group

#### Queries

- `getGroups(userId)` - returns all **Groups** where **User** is a member.
- `getGroup(groupId)` - returns **Group** with a given ID.

#### Mutations

- `createGroup(users)` - creates **Group** containing passed **Users**.
- `updateGroup(groupId,users)` - updates members of **Group** with given ID.
