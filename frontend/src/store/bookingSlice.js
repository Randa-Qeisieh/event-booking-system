import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Basic auth credentials — required for all booking endpoints
const AUTH = {
    auth: {
        username: process.env.REACT_APP_API_USERNAME,
        password: process.env.REACT_APP_API_PASSWORD
    }
};

// Fetch all bookings
export const fetchBookings = createAsyncThunk('bookings/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/bookings/', AUTH);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Create a new booking
export const createBooking = createAsyncThunk('bookings/create', async (bookingData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/bookings/', bookingData, AUTH);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Cancel an existing booking
export const cancelBooking = createAsyncThunk('bookings/cancel', async (bookingId, { rejectWithValue }) => {
    try {
        await axios.post(`/api/bookings/${bookingId}/cancel/`, {}, AUTH);
        return { id: bookingId, status: 'cancelled' };
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const bookingSlice = createSlice({
    name: 'bookings',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    extraReducers: (builder) => {
        builder
            // fetch bookings
            .addCase(fetchBookings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // create booking
            .addCase(createBooking.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items.push(action.payload); // add new booking to list
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // cancel booking
            .addCase(cancelBooking.fulfilled, (state, action) => {
                const index = state.items.findIndex(b => b.id === action.payload.id);
                if (index !== -1) state.items[index].status = 'cancelled';
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default bookingSlice.reducer;