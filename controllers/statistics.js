const { getStats } = require("../database/requests")

const stats = async (req, res) => {
  let statistiques
  if (req.query) {
    statistiques = await getStats(req.query)
  } else {
    statistiques = await getStats()
  }
  res.status(200).json(statistiques)
}

module.exports = { stats }