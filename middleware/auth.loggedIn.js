import jwt from "jsonwebtoken";

export const isloggedIn = (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    res.locals.isloggedIn = false;
    res.locals.user = null;

    if (!accessToken) {
        return next();
    }

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET || "accessSecret123"
        );

        res.locals.isloggedIn = true;
        res.locals.user = decoded;

    } catch (error) {
        res.locals.isloggedIn = false;
        res.locals.user = null;
    }

    next();
};

