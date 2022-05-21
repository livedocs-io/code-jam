export function createNewUser(userId: string, currDate: string): string {
    return `INSERT INTO user (id, date) VALUES ("${userId}", "${currDate}");`;
}
