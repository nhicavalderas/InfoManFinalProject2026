

CREATE TABLE IF NOT EXISTS "user" (
  userid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  user_type VARCHAR(20) DEFAULT 'USER',
  record_status VARCHAR(10) DEFAULT 'INACTIVE'
);

CREATE TABLE IF NOT EXISTS "Module" (
  moduleid VARCHAR(10) PRIMARY KEY,
  modulename VARCHAR(30)
);

INSERT INTO "Module" (moduleid, modulename) VALUES
('Emp_Mod','Employee Module'),
('JH_Mod','Job History Module'),
('Job_Mod','Job Module'),
('Dept_Mod','Department Module'),
('Adm_Mod','Admin Module')
ON CONFLICT (moduleid) DO NOTHING;

CREATE TABLE IF NOT EXISTS rights (
  rightid VARCHAR(10) PRIMARY KEY,
  rightdesc VARCHAR(50),
  moduleid VARCHAR(10) REFERENCES "Module"(moduleid)
);

INSERT INTO rights (rightid, rightdesc, moduleid) VALUES
('EMP_VIEW','View Employees','Emp_Mod'),
('EMP_ADD','Add Employee','Emp_Mod'),
('EMP_EDIT','Edit Employee','Emp_Mod'),
('EMP_DEL','Soft Delete Employee','Emp_Mod'),
('JH_VIEW','View Job History','JH_Mod'),
('JH_ADD','Add Job History','JH_Mod'),
('JH_EDIT','Edit Job History','JH_Mod'),
('JH_DEL','Soft Delete Job History','JH_Mod'),
('JOB_VIEW','View Jobs','Job_Mod'),
('JOB_ADD','Add Job','Job_Mod'),
('JOB_EDIT','Edit Job','Job_Mod'),
('JOB_DEL','Soft Delete Job','Job_Mod'),
('DEPT_VIEW','View Departments','Dept_Mod'),
('DEPT_ADD','Add Department','Dept_Mod'),
('DEPT_EDIT','Edit Department','Dept_Mod'),
('DEPT_DEL','Soft Delete Department','Dept_Mod'),
('ADM_USER','Activate/Manage Users','Adm_Mod')
ON CONFLICT (rightid) DO NOTHING;

CREATE TABLE IF NOT EXISTS "UserModule_Rights" (
  userid UUID REFERENCES "user"(userid),
  rightid VARCHAR(10) REFERENCES rights(rightid),
  right_value INTEGER DEFAULT 0,
  PRIMARY KEY (userid, rightid)
);
