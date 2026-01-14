import axios from 'axios'
import useSWR from "swr";

type GetWeatherParams = {
    city: string
}

export const getWeather = async (params: GetWeatherParams) => {
    const res = await axios.get('http://shanhe.kim/api/za/tianqi.php', { params })
    return res.data.data;
}


export const useGetWeather = (params: GetWeatherParams) => {
    const key = {
        url: 'http://shanhe.kim/api/za/tianqi.php',
        params
    }
    return useSWR(key, () => getWeather(params), {
        suspense: true
    })
}