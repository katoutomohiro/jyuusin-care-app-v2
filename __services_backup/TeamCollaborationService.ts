import { TeamCollaborationNote } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class TeamCollaborationService {
  private static notes: TeamCollaborationNote[] = []; // 本来はデータベースで管理

  static async getNotesForUser(userId: string): Promise<TeamCollaborationNote[]> {
    return this.notes
      .filter(note => note.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static async addNote(noteData: Omit<TeamCollaborationNote, 'id' | 'timestamp'>): Promise<TeamCollaborationNote> {
    const newNote: TeamCollaborationNote = {
      ...noteData,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    this.notes.push(newNote);
    return newNote;
  }

  static async updateNote(noteId: string, content: string): Promise<TeamCollaborationNote | undefined> {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.content = content;
      return note;
    }
    return undefined;
  }

  static async deleteNote(noteId: string): Promise<boolean> {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter(n => n.id !== noteId);
    return this.notes.length < initialLength;
  }

  static async togglePin(noteId: string): Promise<TeamCollaborationNote | undefined> {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.isPinned = !note.isPinned;
      return note;
    }
    return undefined;
  }
} 