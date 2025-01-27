import { Injectable } from '@angular/core';
import { User } from '../../domain/entities/user';
import { PreferenceKeyConst } from './preference-key-const';

@Injectable({
  providedIn: 'root',
})
export class LocalData {
  getUser(): User | null {
    const userJson = localStorage.getItem(PreferenceKeyConst.currentUserKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  setUser(user: User | null): void {
    if (user === null) {
      localStorage.removeItem(PreferenceKeyConst.currentUserKey);
      return;
    }
    localStorage.setItem(
      PreferenceKeyConst.currentUserKey,
      JSON.stringify(user)
    );
  }

  getToken(): Promise<string | null> {
    const token = localStorage.getItem(PreferenceKeyConst.tokenKey);
    return Promise.resolve(token ? token : null);
  }

  setToken(token: String | null): void {
    if (token === null) {
      localStorage.removeItem(PreferenceKeyConst.tokenKey);
      return;
    }
    localStorage.setItem(PreferenceKeyConst.tokenKey, token.toString());
  }

  /**
   * Clears all data stored in the local storage.
   */
  clearAll(): void {
    localStorage.clear();
  }
}
