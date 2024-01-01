import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
// import logger from "../helper/logger";

function UnauthorizedError(message: string) {
    const e = new Error(message);
    e.name = "UnauthorizedError";
    return e;
}

const errorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 400;
    switch (true) {
        case typeof err === "string":
            // custom application error
            const lowerErr = err.toLowerCase();
            if (lowerErr.endsWith("not found")) statusCode = 404;
            if (lowerErr.includes("already")) statusCode = 409;
            // logger.error(err);
            return res.status(statusCode).json({ message: err });
        case err.name === "ValidationError":
            // mongoose validation error
            // logger.error(`${err.name} ${err.message}`);
            return res.status(400).json({ message: err.message });
        case err.name === "UnauthorizedError":
            // jwt authentication error
            // logger.error(`${err.name} ${err.message}`);
            return res
                .status(401)
                .json({ message: "Unauthorized\n" + err.message });
        default:
            // logger.error(`${err.name} ${err.message}`);
            return res.status(500).json({
                message: err.message,
            });
    }
    return next();
};

export { errorHandler, UnauthorizedError };
