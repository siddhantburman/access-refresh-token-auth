import userCreates from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Environment variables
const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || "accessSecret123";

const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || "refreshSecret456";

// Home Page
export const homePage = (req, res) => {
    res.render("home");
};


// About Page
export const aboutPage = (req, res) => {
    res.render("about");
};


// Services Page
export const servicesPage = (req, res) => {
    res.render("service");
};


// Projects Page
export const projectsPage = (req, res) => {
    res.render("project");
};


// Contact Page
export const contactPage = (req, res) => {
    res.render("contact");
};


// Login Page
export const loginPage = (req, res) => {
    res.render("login", {
        title: "Login"
    });
};


// Signup Page
export const signupPage = (req, res) => {
    res.render("signup", {
        title: "Create Account"
    });
};    

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).send("Email and password are required!");
        }

        // 2. Find user by email
        const user = await userCreates.findOne({ email });

        if (!user) {
            return res.status(401).send(
                "User nahi mila! Pehle signup karein."
            );
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send("Galat password!");
        }

        // 4. Generate Access Token
        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email
            },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1m"
            }
        );

        // 5. Generate Refresh Token
        const refreshToken = jwt.sign(
            {
                _id: user._id
            },
            REFRESH_TOKEN_SECRET,
            {
                expiresIn: "3m"
            }
        );

        // 6. Save Refresh Token in database
        user.refreshToken = refreshToken;

        await user.save();

        // 7. Set cookies
        const cookieOptions = {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        };

        res.cookie("accessToken", accessToken, cookieOptions);

        res.cookie("refreshToken", refreshToken, cookieOptions);

        // 8. Redirect to home
        return res.redirect("/");

    } catch (error) {
        console.error("Login Error:", error.message);

        return res.status(500).send("Login failed!");
    }
};

export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send("All fields are required!");
        }

        // Check whether email already exists
        const existingUser = await userCreates.findOne({ email });

        if (existingUser) {
            return res.status(409).render("signup", {
                title: "Create Account",
                error: "This email already exists!",
                name,
                email
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await userCreates.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate Access Token
        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email
            },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1m"
            }
        );

        // Generate Refresh Token
        const refreshToken = jwt.sign(
            {
                _id: user._id
            },
            REFRESH_TOKEN_SECRET,
            {
                expiresIn: "3m"
            }
        );

        // Save Refresh Token
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        };

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.redirect("/");

    } catch (error) {
        console.error("Signup Error:", error.message);
        return res.status(500).send("Signup failed!");
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        // 1. Get Refresh Token from cookie
        const incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            return res.redirect("/login");
        }

        // 2. Verify Refresh Token
        const decoded = jwt.verify(
            incomingRefreshToken,
            REFRESH_TOKEN_SECRET
        );

        // 3. Find user
        const user = await userCreates.findById(decoded._id);

        if (!user) {
            return res.redirect("/login");
        }

        // 4. Match database token
        if (user.refreshToken !== incomingRefreshToken) {
            return res.redirect("/login");
        }

        // 5. Generate new Access Token
        const newAccessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email
            },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1m"
            }
        );

        // 6. Set new Access Token cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        // 7. Redirect
        return res.redirect("/");

    } catch (error) {
        console.error("Refresh Token Error:", error.message);

        // Clear cookies if Refresh Token is invalid or expired
        res.clearCookie("accessToken", { path: "/" });
        res.clearCookie("refreshToken", { path: "/" });

        return res.redirect("/login");
    }
};

export const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // 1. Remove Refresh Token from database
        if (refreshToken) {
            await userCreates.findOneAndUpdate(
                { refreshToken },
                {
                    $set: {
                        refreshToken: null
                    }
                }
            );
        }

        // 2. Cookie options
        const cookieOptions = {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        };

        // 3. Clear cookies
        res.clearCookie("accessToken", cookieOptions);

        res.clearCookie("refreshToken", cookieOptions);

        // 4. Redirect to login
        return res.redirect("/login");

    } catch (error) {
        console.error("Logout Error:", error.message);

        return res.status(500).send("Logout failed!");
    }
};