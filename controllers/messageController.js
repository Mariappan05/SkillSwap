const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const messageController = {
    getUserConversations: async (req, res) => {
        try {
            const conversations = await Conversation.find({
                participants: { $in: [req.user._id] }
            })
            .populate('participants', 'fullName email')
            .populate('lastMessage')
            .sort({ createdAt: -1 }); // Sort by newest first
            
            // Filter out conversations where the same user is both participants
            const validConversations = conversations.filter(conv => {
                const uniqueParticipants = new Set(conv.participants.map(p => p._id.toString()));
                return uniqueParticipants.size === 2;
            });

            res.status(200).json({
                success: true,
                data: validConversations
            });
        } catch (error) {
            console.error('Get conversations error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching conversations',
                error: error.message
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
                sender: req.user._id,
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
    },

    createConversation: async (req, res) => {
        try {
            const { participantId } = req.body;
            const currentUserId = req.user._id;
            
            // Validate participantId
            if (!participantId) {
                return res.status(400).json({
                    success: false,
                    message: 'Participant ID is required'
                });
            }

            // Validate that participantId is not the same as current user
            if (participantId === currentUserId.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot create conversation with yourself'
                });
            }

            // Check if conversation already exists
            const existingConversation = await Conversation.findOne({
                participants: { 
                    $all: [currentUserId, participantId],
                    $size: 2
                }
            });

            if (existingConversation) {
                return res.status(200).json({
                    success: true,
                    data: existingConversation
                });
            }

            // Create new conversation
            const conversation = await Conversation.create({
                participants: [currentUserId, participantId]
            });

            const populatedConversation = await Conversation.findById(conversation._id)
                .populate('participants', 'fullName email');

            res.status(201).json({
                success: true,
                data: populatedConversation
            });
        } catch (error) {
            console.error('Create conversation error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating conversation',
                error: error.message
            });
        }
    }
};

module.exports = messageController;
