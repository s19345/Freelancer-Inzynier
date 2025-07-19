import {createAsyncThunk} from '@reduxjs/toolkit';
import {PROJECT_BACKEND_URL} from '../settings';

export const createProject = createAsyncThunk(
    'project/createProject',
    async (projectData, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        try {
            const res = await fetch(`${PROJECT_BACKEND_URL}projects/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(projectData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                const firstError = Object.values(errorData)[0];
                return thunkAPI.rejectWithValue(firstError[0] || 'B³±d tworzenia projektu');
            }

            await res.json();
            return 'Projekt zosta³ utworzony pomy¶lnie';
        } catch (error) {
            return thunkAPI.rejectWithValue('B³±d sieci podczas tworzenia projektu');
        }
    }
);
