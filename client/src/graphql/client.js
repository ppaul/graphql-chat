import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as createWsClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

const httpLink = new HttpLink({ uri: GRAPHQL_URL });

const wsClient = createWsClient({ url: 'ws://localhost:9000/graphql' });

const wsLink = new GraphQLWsLink(wsClient);

const isSubscription = ({ query }) => {
  const def = getMainDefinition(query);
  return def.kind === Kind.OPERATION_DEFINITION && def.operation === OperationTypeNode.SUBSCRIPTION
}

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  link: split(isSubscription, httpLink, wsLink),
  cache: new InMemoryCache(),
});

export default client;
