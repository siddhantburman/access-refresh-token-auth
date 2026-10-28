import express from "express";
import {
    homePage,
    aboutPage,
    servicesPage,
    projectsPage,
    contactPage,
    loginPage,
    signupPage,
    loginUser,
    signupUser,
    refreshAccessToken,
    logoutUser
} from "../controller/auth.controller.js";
import { verifyAccessToken } from "../middleware/auth.token.js";

const router = express.Router();

// Home Page
router.get("/", homePage);

// About Page
router.get("/about", verifyAccessToken, aboutPage);

// Services Page
router.get("/services", verifyAccessToken, servicesPage);

// Projects Page
router.get("/projects", verifyAccessToken, projectsPage);

// Contact Page
router.get("/contact", verifyAccessToken, contactPage);

// Login Page
router.get("/login", loginPage);

// Login Form Submission
router.post("/login", loginUser);

// Signup Page
router.get("/signup", signupPage);

// Signup Form Submission
router.post("/signup", signupUser);

// Refresh-token
router.get("/refresh-token", refreshAccessToken);

// Logout
router.get("/logout", logoutUser);


export default router;