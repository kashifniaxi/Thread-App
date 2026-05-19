import { typeDefs } from "../users/typedefs.js";
import { resolvers} from "../users/resolvers.js";
import { Queries as userQueries} from "../users/Queries.js";
import { Mutations as userMutations} from "../users/Mutations.js";

export const User = {
    typeDefs,
    resolvers,
    queries: userQueries,
    mutations: userMutations
}
