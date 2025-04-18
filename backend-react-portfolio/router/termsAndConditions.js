const express = require("express");
const authenticateJWT = require("../middleware/authmiddleware.js");
const Terms_Model = require("../models/termsandconditions.js");
const router = express.Router();

// GET All TERMS

router.get("/", async (req, res) => {
  try {
    const TermsAndConditions = await Terms_Model.find().sort({ order: 1 }); // Ensure you're querying by the correct field, `order` and get the result in ascending order
    if (TermsAndConditions.length === 0) {
      return res.status(404).json({ message: "Inforamtion Not Found" });
    }
    res.status(200).json(TermsAndConditions); // 200 OK status code
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// GET TERMS BY SPECIFIC ID

router.get("/:id", async (req, res) => {
  const Id = req.params.id;

  try {
    const TermsAndConditions = await Terms_Model.findById(Id); // Ensure you're querying by the correct `id`
    if (!TermsAndConditions) {
      return res.status(404).send("Inforamtion Not Found");
    }
    res.status(200).json(TermsAndConditions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to fetch data with ${Id}` });
  }
});

// POST TERMS (AUTHENTICATED ONLY)

router.post("/", authenticateJWT, async (req, res) => {
  // console.log("Inside post function");

  const data = new Terms_Model({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const val = await data.save();
    res.status(201).json(val);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// UPDATE TERMS BY ID (AUTHENTICATED ONLY)

router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    // console.log("Request Body", req.body);
    const updatedTerms = await Terms_Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTerms);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: `Failed to Update Terms: ${error.message}` });
  }
});

// DELETE TERMS BY ID (AUTHENTICATED ONLY)

router.delete("/:id", authenticateJWT, async (req, res) => {
  const Id = req.params.id;

  try {
    const TermsAndConditions = await Terms_Model.findByIdAndDelete(Id); // Ensure you're querying by the correct field, `id`
    if (!TermsAndConditions) {
      return res
        .status(404)
        .send({ message: `Information with ID ${Id} not found` });
    }
    res.status(200).send({
      message: `Information with ID ${Id} has been deleted`,
      deletedInfo: TermsAndConditions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to delete data with ${Id}` });
  }
});

// REORDER TERMS BY MAPPING REORDERED TERMS  (AUTHENTICATED ONLY)

router.patch("/reorder", authenticateJWT, async (req, res) => {
  // console.log("req.body.reorderedTerms", req.body.reorderedTerms);
  const { reorderedItems } = req.body; // reorderedTerms: [{ _id, title, content }, ...]
  // console.log("reorderedTerms", reorderedTerms);
  try {
    const bulkOps = reorderedItems.map((term, index) => ({
      updateOne: {
        filter: { _id: term._id },
        update: { $set: { order: index } }, // Assuming you have an 'order' field
      },
    }));

    await Terms_Model.bulkWrite(bulkOps);
    // console.log("Terms reordered in the database");
    res.status(200).json({ message: "Terms reordered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
