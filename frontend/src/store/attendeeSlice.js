import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/attendees/';

const AUTH = {
    auth: {
        username: process.env.REACT_APP_API_USERNAME,
        password: process.env.REACT_APP_API_PASSWORD
    }
};

export const fetchAttendees = createAsyncThunk('attendees/fetch', async () => {
    const response = await axios.get(API_URL, AUTH);
    return response.data;
});

export const createAttendee = createAsyncThunk('attendees/create', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, data, AUTH);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const attendeeSlice = createSlice({
    name: 'attendees',
    initialState: { items: [], status: 'idle', error: null },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAttendees.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'succeeded';
            })
            .addCase(createAttendee.fulfilled, (state, action) => {
                state.items.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createAttendee.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default attendeeSlice.reducer;