import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  USERS: '@local_users',
} as const;

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

class LocalUserStore {
  private users: LocalUser[] = [];
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    try {
      const storedUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : [];
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing local user store:', error);
      this.users = [];
    }
  }

  private async saveUsers() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw new Error('Failed to save user data');
    }
  }

  async createUser(name: string, email: string, password: string): Promise<LocalUser> {
    await this.init();

    // Check if email already exists
    if (this.users.some(user => user.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser: LocalUser = {
      id: uuidv4(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    await this.saveUsers();
    return newUser;
  }

  async validateUser(email: string, password: string): Promise<LocalUser> {
    await this.init();
    
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return user;
  }

  async getAllUsers(): Promise<Omit<LocalUser, 'password'>[]> {
    await this.init();
    return this.users.map(({ password, ...user }) => user);
  }

  async deleteAllUsers(): Promise<void> {
    this.users = [];
    await this.saveUsers();
  }
}

export const localUserStore = new LocalUserStore(); 