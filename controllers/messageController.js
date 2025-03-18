const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const messageController = {
    getUserConversations: async (req, res) => {
        try {
            const conversations = await Conversation.find({
                participants: { $in: [req.user.userId] }
            })
            .populate('participants', 'fullName email')
            .populate('lastMessage');
            
            res.status(200).json({
                success: true,
                data: conversations
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching conversations'
            });
        }
    },

    getConversation: async (req, res) => {
        try {
            const messages = await Message.find({
                conversation: req.params.conversationId
            })
            .populate('sender', 'fullName email')
            .sort({ createdAt: -1 });
            
            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching conversation'
            });
        }
    },

    sendMessage: async (req, res) => {
        try {
            const { conversationId, content } = req.body;
            
            const message = await Message.create({
                conversation: conversationId,
                sender: req.user.userId,
                content
            });

            // Update last message in conversation
            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: message._id
            });

            const populatedMessage = await Message.findById(message._id)
                .populate('sender', 'fullName email');
            
            res.status(201).json({
                success: true,
                data: populatedMessage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error sending message'
            });
        }
    }
};

module.exports = messageController;
