import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  email: string | null;
  name: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userId: localStorage.getItem('userId'),
  email: localStorage.getItem('email'),
  name: localStorage.getItem('name'), // We will need to store this on login
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: string; email: string; name: string; token: string }>) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('name', action.payload.name);
      localStorage.setItem('authToken', action.payload.token);
    },
    logout: (state) => {
      state.userId = null;
      state.email = null;
      state.name = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('authToken');
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
