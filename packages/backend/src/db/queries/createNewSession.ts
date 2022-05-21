export function createNewSessionForUser(userId: string, currDate: string): string {
    return `UPDATE user SET date = "${currDate}" WHERE id = "${userId}";`;
}
