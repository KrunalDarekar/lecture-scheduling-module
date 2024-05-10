# Lecture Scheduling Module

An online lecture scheduling module built for a take-home assignment.

## Deployment

- [Website](https://lecture-scheduling-module.vercel.app/)

## Routes

### Accessible to Everyone

- [Homepage `/`](https://lecture-scheduling-module.vercel.app/): Redirects you to the respective dashboard if logged in. If not logged in, prompts you to log in.
- [Admin Login `/signin/admin`](https://lecture-scheduling-module.vercel.app/signin/admin): Admin login page.
- [Instructor Login `/signin/instructor`](https://lecture-scheduling-module.vercel.app/signin/instructor): Instructor login page.

### Accessible to Admin

- [Admin Dashboard `/admin`](https://lecture-scheduling-module.vercel.app/admin): Admin dashboard.
- Course Details `/course/:id`: Displays the details of a specific course by its ID and allows you to add more lectures.
- [Create Course `/create`](https://lecture-scheduling-module.vercel.app/create): Lets you create a new course.

### Accessible to Instructor

- [Instructor Dashboard `/instructor`](https://lecture-scheduling-module.vercel.app/instructor): Instructor dashboard.
