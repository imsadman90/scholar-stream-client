PROJEXT_NAME : SCHOLARSTREAM

PURPOSE : 
ScholarStream is designed to empower students by providing a centralized platform for discovering scholarships, grants, and educational opportunities. Our goal is to simplify the search process, ensuring students can easily find relevant funding options, compare eligibility criteria, and stay updated on deadlines. By offering an intuitive interface, personalized recommendations, and verified information, ScholarStream aims to make education more accessible and help students achieve their academic and professional aspirations without financial barriers.

LIVE URL : https://scholar-stream-client.web.app

KEY FEATURES OF SCHOLARSTREAM : 
1. Centralized Scholarship Platform
Connects students with scholarships from universities and organizations in one place, simplifying the search for financial aid.

2. Role-Based Dashboards
Student: Apply for scholarships, track applications, make payments, add reviews, and manage personal profile.

Moderator: Manage applications, provide feedback, update status, and moderate reviews.

Admin: Add/edit scholarships, manage users, view analytics, and monitor platform activity.

3. Comprehensive Scholarship Listings
Display scholarships with university info, world rank, category, degree, application fees, and deadlines. Supports search, filter, and server-side sorting for quick discovery.

4. Secure Payment Integration
Students can pay application fees via Stripe. Handles payment success and failure with automatic application status updates.

5. Application Management System
Track the status of scholarship applications from Pending → Processing → Completed, with moderator feedback and student notifications.

6. Reviews & Ratings
Students can leave reviews and ratings for scholarships/universities. Moderators can manage inappropriate reviews.

7. Advanced Search, Filter & Sort
Search by scholarship name, university, or degree. Filter by country, category, or subject. Sort by application fees or post date.

8. Responsive & User-Friendly Interface
Clean, modern, and consistent design using DaisyUI, with animations on the home page via Framer Motion.

9. Personalized Features

Top Scholarships section

10. Dashboard Analytics (Admin)
Visual representation of total users, scholarships, applications, and payments with charts for better insights.

11. Secure Authentication
Includes email/password login, Google social login, password validation, and JWT-based API security with role verification.

12. Robust Error Handling & UX Enhancements
Custom 404 page, loading spinners/skeletons on data fetch, and smooth navigation without route errors on reload.

13. Complete CRUD Functionality
Admins can add, update, and delete scholarships and users; moderators manage applications and reviews; students manage applications and reviews.

14. Payment & Application Tracking
Students can view detailed application status, edit or delete pending applications, and track successful payments.

15. Modern Design & Responsiveness
Fully responsive layout for mobile, tablet, and desktop, with consistent spacing, grid-based scholarship cards, and visually appealing UI elements.

CLIENT-SIDE PACKAGES (REACT)

react – Core React library
react-dom – React DOM rendering
react-router-dom – Routing and navigation
framer-motion – Animations (Home page, transitions)
react-icons – Icons for Navbar, Dashboard, and UI elements
axios – HTTP requests to backend API
stripe/react-stripe-js – Stripe integration for payments
@stripe/stripe-js – Stripe JS SDK
react-hook-form – Form handling (registration, login, scholarship forms)
sweetalert2 – Alerts and confirmation dialogs (success/failure messages)
dotenv – Environment variables management (Firebase keys, API URLs)
react-query / @tanstack/react-query – Optional, for fetching and caching server data efficiently
react-paginate – Pagination for All Scholarships page (if implemented)