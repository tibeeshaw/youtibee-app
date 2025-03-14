import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


enum TagType {
  Video = 'Video',
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: Object.values(TagType),
  endpoints: (build) => ({
    search: build.query<
      any,
      { q: string }
    >({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ q }) => ({
        url: `movie`,
        params: { q },
      }),
      providesTags: (result, error, { q }) => [{ type: TagType.Video, q }],
    }),
    getMovie: build.query<any, { id: number }>({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ id }) => ({
        url: `movie/${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: TagType.Video, id }],
    }),
  }),
});

export const {
  useSearchQuery,
  useGetMovieQuery,
} = api;
