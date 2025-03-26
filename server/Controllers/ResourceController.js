const Resource = require("../Models/ResourceModel");

const createResourse = async (req, res) => {
    try {
      const { quiz, userId, appointmentId } = req.body;
  
      // Validate that quiz is provided and is a non-empty array.
      if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
        return res.status(400).json({ error: "Please provide quiz details" });
      }
  
      // Validate that each quiz entry has both question and answer.
      for (const entry of quiz) {
        if (!entry.question || !entry.answer) {
          return res.status(400).json({ error: "Please provide both question and answer for each quiz entry" });
        }
      }
  
      // Check if a Resource already exists for the given userId and appointmentId.
      const resource = await Resource.findOne({ userId, appointmentId });
      
      if (resource) {
        // If the resource exists, return a message indicating it already exists.
        return res.status(200).json({ error: "Resource already created for this appointment" });
      } else {
        // Create a new Resource document with the quiz array.
        const newResource = new Resource({ userId, appointmentId, quiz });
        await newResource.save();
        return res.status(201).json({ success: "Quiz created successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create quiz" });
    }
  };
  
  
  const getResource = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const resource = await Resource.findOne({ appointmentId });
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      return res.json(resource);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  };


module.exports = { createResourse, getResource };