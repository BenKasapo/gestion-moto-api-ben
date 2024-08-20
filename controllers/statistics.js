const { getStats, getStatsByAssociation, getStatsByProgram } = require("../database/requests")

const stats = async (req, res) => {
  let statistiques
  if (req.query) {
    statistiques = await getStats(req.query)
  } else {
    statistiques = await getStats()
  }
  res.status(200).json(statistiques)
}

const getstatsAssociation = async (req, res) => {
  const { association } = req.params

  if (!association) {
    return res.status(400).json({ error: "L'association est requise" })
  }

  try {
    const stats = await getStatsByAssociation(association)
    res.status(200).json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

const getstatsProgram = async (req, res) => {
  const { program } = req.params

  if (!program) {
    return res.status(400).json({ error: "Le program est requis" })
  }

  try {
    const stats = await getStatsByProgram(program)
    res.status(200).json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({ error: "Internal Server Error program" })
  }
}

module.exports = { stats, getstatsAssociation, getstatsProgram }
