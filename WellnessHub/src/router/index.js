import DashboardView from "@/views/DashboardView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RatingView from "@/views/RatingView.vue";
import SignUpView from "@/views/SignUpView.vue";
import FirebaseSignUpView from "@/views/FirebaseSignUpView.vue";
import { createRouter, createWebHistory } from "vue-router";
import FirebaseLoginView from "@/views/FirebaseLoginView.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EmailView from "@/views/EmailView.vue";
import ClinicsView from "@/views/ClinicsView.vue";
import AdminDashboardView from "@/views/AdminDashboardView.vue";
import BulkEmailsView from "@/views/BulkEmailsView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/review",
    name: "Review",
    component: RatingView,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/firebase-signup",
    name: "FirebaseSignUp",
    component: FirebaseSignUpView,
  },
  {
    path: "/firebase-login",
    name: "FirebaseLogin",
    component: FirebaseLoginView,
  },
  {
    path: "/send-email",
    name: "SendEmail",
    component: EmailView,
    meta: { requiresAuth: true },
  },
  {
    path: "/send-bulk-emails",
    name: "SendBulkEmails",
    component: BulkEmailsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/clinics",
    name: "Clinics",
    component: ClinicsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "Users",
    component: AdminDashboardView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next();
      } else {
        next("/firebase-login");
      }
    });
  } else {
    next();
  }
});

export default router;
