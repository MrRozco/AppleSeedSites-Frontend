import { cache } from "react";
import qs from "qs";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export async function fetchAPI(endpoint, query ={}, options ={}) {

    const queryString = qs.stringify(query, {
        encodeValuesOnly: true,
    });
    const url = `${API_URL}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;

    try{
        const response = await fetch( url ,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },

                cache: 'no-cache',
                ...options,   
            });

        if(!response.ok){
            console.error(`Failed to fetch API: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(`Error fetching from Strapi at ${endpoint}:`, error);
        throw error;;
    }

}

export async function getSingleType( type, query ={} ) {

    const data = await fetchAPI(type, query);
    return data?.data || null;

}