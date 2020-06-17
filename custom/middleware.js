const logger = (req, res, next) => {
    const method = req.method;
    const endpoint = req.originalUrl;
    const date = new Date();

    console.log(`You made a ${method} request to ${endpoint} on ${date}`);
    next();
};

module.exports = {
    logger
}