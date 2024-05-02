import { readFileSync, writeFileSync } from 'fs';
import { Person } from '../interfaces';

class UserModel {
    private userData: Person[] = [];

    constructor() {
        this.loadUserData();
    }

    loadUserData() {
        try {
            const userDataString = readFileSync(require.resolve("./userData.json"), 'utf-8');
            this.userData = JSON.parse(userDataString);
        } catch (error) {
            console.error('Error loading user data:', error);
            this.userData = [];
        }
    }

    private saveUserData(): void {
        try {
            const jsonData = JSON.stringify(this.userData, null, 2);
            writeFileSync(require.resolve("./userData.json"), jsonData, 'utf-8');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    storeUserData(data: Person[]): void {
        console.log('called');
        this.userData = data;
        this.saveUserData();
    }

    filterDataByQuery(query: string): Person[] {
        return this.userData.filter((user) =>
            Object.values(user).some((value) =>
                value.toLowerCase().includes(query.toLowerCase())
            )
        );
    }
}

export default UserModel;
