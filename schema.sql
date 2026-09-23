CREATE TABLE projects (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL
);

CREATE TABLE tasks (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES projects(id),
  title text NOT NULL,
  description text,
  status text NOT NULL,
  assignee_id text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
