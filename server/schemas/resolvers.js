const {AuthenicationError} = require('apollo-server-express');
const { User } = require('../models');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if (context.user){
                const userData = await User.findOne({_id: context.user._id}).select('-__v -password')
                return userData
            }
           throw new AuthenicationError('Not Logged In')
        }
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email})
            if (!user) {
                throw new AuthenicationError('Invalid Email or password')
            }
            const validPassword = await user.isCorrectPassword(password)
            if (!validPassword) {
                throw new AuthenicationError('Invalid Email or password')
            }
            const token = signToken(user)
            return {
                token, user
            }
        },
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)
            return {
                token, user
            }
        },
        saveBook: async (parent, {bookData}, context ) => {
            if (context.user) {
                const updatedUser = await user.findByIdAndUpdate(
                    {_id: context.user._id}, 
                    {$push: {savedBooks: bookData}},
                    {new: true}
                )
                return updatedUser
            }
            throw new AuthenicationError('Not logged In')
        } 
    }
}