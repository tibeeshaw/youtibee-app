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
      object,
      { q: string }
    >({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ q }) => ({
        url: `movie`,
        params: { q },
      }),
      providesTags: (result, error, { q }) => [{ type: TagType.Video, q }],
    }),
  }),
});

export const {
  useSearchQuery,
} = api;
