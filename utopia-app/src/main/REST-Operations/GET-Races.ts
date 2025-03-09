

const GETRaces = (server, db, link: string) => {
  server.get(link, async (req, res) => {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' })
    }

    try {
      const data = await db.collection('Races').find().toArray()
      res.json(data) // Send back the fetched data
    } catch (err) {
      console.error('Error fetching data:', err)
      res.status(500).json({ error: 'Failed to fetch data' })
    }
  })
}

export default GETRaces;