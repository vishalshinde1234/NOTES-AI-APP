const Note = require('../models/Note');

const getNotes = async (req, res, next) => {
  try {
    const { search, archived = 'false' } = req.query;
    const filter = { userId: req.user._id, isArchived: archived === 'true' };
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });
    res.json({ success: true, total: notes.length, data: notes });
  } catch (err) { next(err); }
};

const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, note });
  } catch (err) { next(err); }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, note });
  } catch (err) { next(err); }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, message: 'Note deleted.', deletedId: req.params.id });
  } catch (err) { next(err); }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };