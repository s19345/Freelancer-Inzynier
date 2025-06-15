import { createAsyncThunk } from '@reduxjs/toolkit';
import { USERS_BACKEND_URL } from '../settings';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const res = await fetch(`${USERS_BACKEND_URL}login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.nickname,
          password: credentials.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return thunkAPI.rejectWithValue(
          errorData?.non_field_errors?.[0] || 'Błąd logowania'
        );
      }

      const data = await res.json();
      return { token: data.key };
    } catch (error) {
        console.error(error)
      return thunkAPI.rejectWithValue(`Błąd logowania, ${error}`);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    try {
      const res = await fetch(`${USERS_BACKEND_URL}logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) {
        return thunkAPI.rejectWithValue('Wylogowanie nie powiodło się');
      }

      return true;
    } catch (error) {
        console.error(error)
      return thunkAPI.rejectWithValue('Błąd sieci podczas wylogowania');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    try {
      const res = await fetch(`${USERS_BACKEND_URL}user/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) {
        return thunkAPI.rejectWithValue('Nie udało się pobrać danych użytkownika');
      }

      return await res.json();
    } catch (error) {
        console.error(error)
      return thunkAPI.rejectWithValue('Błąd sieci przy pobieraniu danych użytkownika');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      const res = await fetch(`${USERS_BACKEND_URL}registration/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const firstError = Object.values(errorData)[0];
        return thunkAPI.rejectWithValue(firstError[0]);
      }

      return 'Rejestracja zakończona sukcesem';
    } catch (error) {
        console.error(error)
      return thunkAPI.rejectWithValue('Błąd sieci');
    }
  }
);

export const updateUserData = createAsyncThunk(
  'auth/updateUserData',
  async (updatedData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    try {
      const res = await fetch(`${USERS_BACKEND_URL}user/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return thunkAPI.rejectWithValue(errorData);
      }

      return await res.json();
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue('Błąd aktualizacji danych');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword1, newPassword2 }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    try {
      const res = await fetch(`${USERS_BACKEND_URL}password/change/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password1: newPassword1,
          new_password2: newPassword2,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const firstError = Object.values(errorData)[0];
        return thunkAPI.rejectWithValue(firstError ? firstError[0] : 'Błąd zmiany hasła');
      }

      return 'Hasło zostało zmienione pomyślnie';
    } catch (error) {
      return thunkAPI.rejectWithValue('Błąd sieci podczas zmiany hasła');
    }
  }
);


