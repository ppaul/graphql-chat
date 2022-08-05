import { Message } from './db.js';
import { PubSub } from 'graphql-subscriptions';


const pubSub = new PubSub();

function rejectIf(condition) {
  if (condition) {
    throw new Error('Unauthorized');
  }
}

export const resolvers = {
  Query: {
    messages: (_root, _args, { userId }) => {
      rejectIf(!userId);
      return Message.findAll();
    }
  },

  Mutation: {
    addMessage: async (_root, { input }, { userId }) => {
      rejectIf(!userId);
      const messageAdded = await Message.create({ from: userId, text: input.text });
      pubSub.publish("MESSAGE_ADDED", { messageAdded })
      return messageAdded;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: () => pubSub.asyncIterator("MESSAGE_ADDED")
    }
  }
};
