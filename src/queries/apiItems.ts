import { gql } from "./__generated__/gql";
import { initializeApollo } from "@/lib/apolloClient";
import { cache } from "react";

export const revalidate = 2.5 * 60; // 2.5 minutes (tarkov.dev api cache is 5 minutes)

const apolloClient = initializeApollo();

export const getItemById = cache(async (id: string) => {
  return apolloClient.query({
    query: gql(`
      query itemById($id: ID) {
        item(id: $id) {
          id
          name
          shortName
          iconLink
          image512pxLink
          avg24hPrice
        }
      }
    `),
    variables: {
      id: id,
    },
  });
});

export const getItemsByIds = cache(async (ids: string[]) => {
  return apolloClient.query({
    query: gql(`
      query itemsByIds($ids: [ID]) {
        items(ids: $ids) {
          id
          name
          shortName
          iconLink
          image512pxLink
          avg24hPrice
        }
      }
    `),
    variables: {
      ids: ids,
    },
  });
});

export const getItemsByName = cache(
  async (name: string, limit: number = -1, offset: number = 0) => {
    return apolloClient.query({
      query: gql(`
      query itemsByName($name: String, $limit: Int, $offset: Int) {
        items(name: $name, limit: $limit, offset: $offset) {
          id
          name
          shortName
          iconLink
          image512pxLink
          avg24hPrice
        }
      }
    `),
      variables: {
        name: name,
        limit: limit,
        offset: offset,
      },
    });
  },
);
