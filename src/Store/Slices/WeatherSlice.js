import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios";
import { appId, hostName } from "../../Config/config";

export const getCityData = createAsyncThunk("city", async(obj)=>{
    try{
      const request = await axios.get(`${hostName}/data/2.5/weather?q=${obj.city}&units=${obj.unit}&APPID=${appId}`);
      const response = await request.data;
      return{
        data: response,
        error:null,
      }
    }
    catch(error){
        return{
            data:null,
            error:error.response.data.message,
        }
    }
});

//5 days forcast of the provided city
export const get5DaysForcast = createAsyncThunk("5days",async(obj)=>{
    const request = await axios.get(`${hostName}/data/2.5/forecast?lat=${obj.lat}&lon=${obj.lon}&units=${obj.unit}&APPID=${appId}`);
    const response = await request.data;
    return response;

}) 

const weatherSlice = createSlice({
    name:'weather',
    initialState:{
        citySearchLoading:false,
        citySearchData:null,
        forecastLoading:false,
        forecastData:null,
        forecastError:null,
    },
    extraReducers:(builder)=>{
        builder
        //city search
        .addCase(getCityData.pending,(state)=>{
            state.citySearchLoading=true;
            state.citySearchData = null;
        })
        .addCase(getCityData.fulfilled,(state,action)=>{
            state.citySearchLoading=false;
            state.citySearchData = action.payload
        })
        //forecast 
        .addCase(get5DaysForcast.pending,(state)=>{
            state.forecastLoading=true;
            state.forecastData= null;
            state.forecastError=null;
        })
        .addCase(get5DaysForcast.fulfilled,(state,action)=>{
            state.forecastLoading=false;
            state.forecastData = action.payload;
            state.forecastError=null;
        })
        .addCase(get5DaysForcast.rejected,(state,action)=>{
            state.forecastLoading=false;
            state.forecastData = null;
            state.forecastError=action.error.message;
        })
        
    }
});

export default weatherSlice.reducer;