function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateExpiryTime() {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    return expiresAt;
}

module.exports = {
    generateOtp,
    generateExpiryTime,
};