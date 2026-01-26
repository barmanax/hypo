export function getCurrentUserId(): string {
    const id = process.env.DEV_USER_ID;
    if (!id) {
        throw new Error("DEV_USER_ID is not set in environment variables");  
    } 
    return id;  
}

