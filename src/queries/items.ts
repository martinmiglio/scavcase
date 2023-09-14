import { gql } from "./__generated__/gql";
import { initializeApollo } from "@/lib/apolloClient";

const apolloClient = initializeApollo();

export async function getItemById(id: string) {
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
}

export async function getItemsByIds(ids: string[]) {
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
}

export async function getItemsByName(
  name: string,
  limit: number = -1,
  offset: number = 0,
) {
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
}
