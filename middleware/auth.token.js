import jwt from "jsonwebtoken";
import userCreates from "../models/user.js";

export const verifyAccessToken = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;

    // Access token missing
    if (!accessToken && !refreshToken) {
        return res.redirect("/login");
    }

    try {
        // Verify access token
        req.user = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET || "accessSecret123"
        );

        return next();

    } catch (error) {
        if (error.name !== "TokenExpiredError") {
            return res.redirect("/login");
        }
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || "refreshSecret456"
        );

        const user = await userCreates.findById(decoded._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.redirect("/login");
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET || "accessSecret123",
            { expiresIn: "1m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        req.user = { _id: user._id, email: user.email };

        return next();

    } catch (error) {
        res.clearCookie("accessToken", { path: "/" });
        res.clearCookie("refreshToken", { path: "/" });

        return res.redirect("/login");
    }
};
