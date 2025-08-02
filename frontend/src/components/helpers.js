export function daysSince(dateString) {
    const pastDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - pastDate;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function daysUntil(dateString) {
    const futureDate = new Date(dateString);
    const now = new Date();
    const diffMs = futureDate - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}