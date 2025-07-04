const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    console.log("Message from:", from, "to:", to, "message:", message);

    const data = await messageModel.create({
      message,           
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully" });
    return res.json({ msg: "Failed to add message to the database" });

  } catch (error) {
    console.error("Add message error:", error.message); 
    next(error);
  }
};


module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    console.log("Fetching messages from:", from, "to:", to);

    const messages = await messageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
       return {
        fromSelf:msg.sender.toString()=== from,
        message: msg.message.text,
      };    
    });
     return res.json(projectedMessages);
  } catch (error) {
    console.error("Get all messages error:", error.message);
    next(error);
  }
};
