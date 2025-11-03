// Mock notes service for property annotations
const NOTES_STORAGE_KEY = 'property_notes';

class NotesService {
  // Get all property notes from localStorage
  getAllNotes() {
    const notes = localStorage.getItem(NOTES_STORAGE_KEY);
    return notes ? JSON.parse(notes) : {};
  }

  // Get note for a specific property
  getPropertyNote(propertyId) {
    const allNotes = this.getAllNotes();
    return allNotes[propertyId] || '';
  }

  // Save note for a property
  savePropertyNote(propertyId, note) {
    const allNotes = this.getAllNotes();
    if (note.trim()) {
      allNotes[propertyId] = note.trim();
    } else {
      delete allNotes[propertyId];
    }
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));
    return Promise.resolve();
  }

  // Delete note for a property
  deletePropertyNote(propertyId) {
    const allNotes = this.getAllNotes();
    delete allNotes[propertyId];
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));
    return Promise.resolve();
  }
}

export default new NotesService();