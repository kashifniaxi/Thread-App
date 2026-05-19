const queries: Record<string, any> = {}
const mutations: Record<string, any> = {
    createUser: async (_: any, {}: {}) => {
        return "User created successfully";
    },
}

export const resolvers = {queries, mutations}