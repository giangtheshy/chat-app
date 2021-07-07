module.exports = (res, error) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    let key = ""
    for (i in error.keyValue) {
      key = i
    }
    res.status(500).json({ message: `${key} have been exists!` })
  } else {
    res.status(500).json({ message: error.message })

  }
}