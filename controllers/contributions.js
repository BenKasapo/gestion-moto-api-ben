const {
  createContribution,
  retrieveContributions,
  retrieveContribution,
  changeContribution,
  removeContribution,
} = require("../database/requests")

/* const addContribution = async (req, res) => {
    if (!await createContribution(req.body)) {
        res.status(500).send("Cannot create a contribution")
    } else {
        res.status(201).send("Contribution created")
    }
} */
const addContribution = async (req, res) => {
  try {
    // Attempt to create a contribution
    const result = await createContribution(req.body)

    // Check the result
    if (!result.success) {
      // Handle the case where the contribution already exists
      if (result.message === "Contribution already exists") {
        return res.status(409).json({
          success: false,
          message: result.message,
          contributionId: result.contributionId, // Include existing contribution ID
        })
      }
      // Handle other errors
      return res.status(500).json({
        success: false,
        message: result.message,
        error: result.error, // Include error details for debugging
      })
    }

    // Contribution created successfully
    return res.status(201).json({
      success: true,
      message: "Contribution created successfully",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message, // Include error message for debugging
    })
  }
}

const getContributions = async (req, res) => {
  let contribs
  if (req.query) {
    contribs = await retrieveContributions(req.body.association_id, req.query)
  } else {
    contribs = await retrieveContributions(req.body.association_id)
  }
  res.status(200).json(contribs)
}

const getContribution = async (req, res) => {
  const contrib = await retrieveContribution(req.params.id)
  res.status(200).json(contrib)
}

const updateContribution = async (req, res) => {
  if (!(await changeContribution(req.params.id, req.body))) {
    res.status(500).send("Cannot update contribution")
  } else {
    res.status(200).send("Contribution updated")
  }
}

const deleteContribution = async (req, res) => {
  if (!(await removeContribution(req.params.id))) {
    res.status(500).send("Cannot delete contribution")
  } else {
    res.status(200).send("Contribution deleted")
  }
}

module.exports = {
  addContribution,
  getContributions,
  getContribution,
  updateContribution,
  deleteContribution,
}
