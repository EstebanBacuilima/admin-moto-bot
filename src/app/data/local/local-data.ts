import { Injectable } from '@angular/core';
import { User } from '../../domain/entities/user';
import { PreferenceKeyConst } from './preference-key-const';
import { TokenResponse } from '../../domain/models/toke-response';

@Injectable({
  providedIn: 'root',
})
export class LocalData {
  getUser(): User | null {
    const userJson = localStorage.getItem(PreferenceKeyConst.currentUserKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  getSimpleToken(): String {
    const token = localStorage.getItem(PreferenceKeyConst.tokenKey);
    return token ? token : '';
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

  getTokenResponde(): TokenResponse | null {
    const data = localStorage.getItem(PreferenceKeyConst.tokenResponse);
    return data ? JSON.parse(data) : null;
  }

  setTokenResponde(token: TokenResponse | null): void {
    if (token === null) {
      localStorage.removeItem(PreferenceKeyConst.tokenResponse);
      return;
    }
    localStorage.setItem(
      PreferenceKeyConst.tokenResponse,
      JSON.stringify(token)
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
