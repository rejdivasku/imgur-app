import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = 'fbb22e32a9ca83cd5e7ffdfc1edc22d7fdb128e2';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.imgur.com/3',
    prepareHeaders(headers) {
      headers.set('Authorization', `Bearer ${API_KEY}`);
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      fetchPosts: builder.query({
        query(limit) {
          return `/gallery/${limit}/top/day/0`;
        },
      }),
    };
  },
});

export const { useFetchPostsQuery } = apiSlice;