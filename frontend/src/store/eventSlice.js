import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/events/';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

const eventSlice = createSlice({
    name: 'events',
    initialState: { items: [], status: 'idle' },
    extraReducers: (builder) => {
        builder.addCase(fetchEvents.fulfilled, (state, action) => {
            state.items = action.payload;
            state.status = 'succeeded';
        });
    },
});
export default eventSlice.reducer;