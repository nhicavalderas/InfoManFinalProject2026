## Hope HR System
A modern Human Resource Management System with role-based access control built using React, Vite, Supabase, and Tailwind CSS.
The system allows organizations to manage employees, job history records, departments, user permissions, and administrative access through a secure and responsive web application.

## Project Overview
The Hope HR System was developed collaboratively through Agile Sprint development across Sprint 1, Sprint 2, and Sprint 3.
The project focuses on:


Employee Management


Job History Tracking


Department & Job Management


Role-Based Access Control


Google OAuth Authentication


Admin User Management


Soft Delete & Recovery


QA Testing & Documentation


As of May 20, 2026:


52 Pull Requests merged


Sprint 3 nearing completion


Live deployment running on Vercel

## Features

## Employee Management

View employee records

Add new employees

Edit employee information

Soft-delete employees

Search employees

Employee detail pages

## Job History Management

Track employee job history

Add/edit/delete history records

Embedded Job History Panel

Chronological history sorting

## Jobs & Departments

Manage job codes

Manage departments

CRUD operations

Rights-gated controls

## Authentication & Authorization

Google OAuth login

Protected routes

USER / ADMIN / SUPERADMIN roles

Dynamic rights loading

## Admin Module

Activate/deactivate users

View user statistics

Manage account permissions

## Deleted Items Recovery

Recover soft-deleted records

Module-based filtering

## Tech Stack

## Frontend

React

Vite

Tailwind CSS

## Backend & Database

Supabase

## Authentication

Google OAuth

Supabase Auth

## Deployment

Vercel

## Version Control

GitHub

## Team Members & Roles

| Member            | Role                             | Responsibilities                                                                   |
| ----------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| Nhica Valderas    | **M1 — Project Lead**            | Project setup, deployment, API integration, Supabase setup, GitHub workflow        |
| Jovin Lowell Dula | **M2 — Frontend Developer**      | UI/UX development, frontend pages, CRUD interfaces, API integration, rights gating |
| Jhunelle Remo     | **M3 — Database Engineer**       | Database schema, triggers, RLS policies, Supabase backend, verification scripts    |
| Salim Sahipa      | **M4 — Rights & Authentication** | Google OAuth, AuthContext, permissions, protected routes, rights loading           |
| JM Belen          | **M5 — QA & Documentation**      | QA testing, bug reporting, user manual, sprint logs, presentation, documentation   |

| Role                    | Sprint 1 | Sprint 2 | Sprint 3    | Overall |
| ----------------------- | -------- | -------- | ----------- | ------- |
| M1 — Project Lead       | DONE     | DONE     | IN PROGRESS | 90%     |
| M2 — Frontend Developer | DONE     | DONE     | DONE        | 100%    |
| M3 — Database Engineer  | DONE     | DONE     | DONE        | 98%     |
| M4 — Rights & Auth      | DONE     | DONE     | IN PROGRESS | 80%     |
| M5 — QA & Documentation | DONE     | DONE     | IN PROGRESS | 70%     |

## System Roles
## USER

Can:

View records

Search employees

View details

Cannot:

Add/Edit/Delete records

Access Admin panel

Access Deleted Items

## ADMIN

Can:

Perform CRUD operations

Manage users

Recover deleted records

Access Admin tools

## SUPERADMIN

Can:

Access all ADMIN functionality

Protected from deactivation
## Installation & Setup

Clone Repository

git clone https://github.com/nhicavalderas/InfoManFinalProject2026.git

cd InfoManFinalProject2026

Install Dependencies

npm install

Start Development Server

npm run dev

Build Project

npm run build

## Environment Variables

VITE_SUPABASE_URL=your_supabase_ur

lVITE_SUPABASE_ANON_KEY=your_supabase_anon_key

## Project Structure

src/
├── components/
├── pages/
├── contexts/
├── hooks/
├── services/
├── layouts/
├── utils/
└── assets/

## QA Testing
The system includes:

51 Rights Matrix Test Cases

Authentication Testing

CRUD Validation

Soft Delete Testing

Rights Gating Testing

Admin Module Testing

Production E2E Checklist

## Current Known Issues

| Issue                              | Assigned To | Status |
| ---------------------------------- | ----------- | ------ |
| Vercel 404 on refresh/direct URL   | M1          | URGENT |
| Missing job history seed data      | M3          | HIGH   |
| user_module foreign key constraint | M3          | HIGH   |

## Deployment
Live Website

https://info-man-final-project2026.vercel.app?utm_source=chatgpt.com

GitHub Repository

https://github.com/nhicavalderas/InfoManFinalProject2026?utm_source=chatgpt.com

## Future Improvements

Audit logs

PDF/Excel exports

Employee profile photos

Notifications system

Mobile responsiveness improvements

Advanced search filters

## License
This project is for academic purposes only.
