import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Subject } from '@/types/Subject';
import { AppStorage } from '@/storage';

type SubjectsState = {
    subjects: Subject[];
    addSubject: (subject: Omit<Subject, 'id'>) => void;
    removeSubject: (id: string) => void;
    updateSubject: (id: string, updates: Partial<Subject>) => void;
}

export const useSubjectsStore = create<SubjectsState>()(
    persist(
        (set) => ({
            subjects: [],
            addSubject: (subject) =>
                set((state) => ({
                    subjects: [...state.subjects, { ...subject, id: Date.now().toString() }],
                })),
            removeSubject: (id) =>
                set((state) => ({
                    subjects: state.subjects.filter((s) => s.id !== id),
                })),
            updateSubject: (id, updates) =>
                set((state) => ({
                    subjects: state.subjects.map((s) =>
                        s.id === id ? { ...s, ...updates } : s
                    ),
                }))
        }),
        {
            name: 'subjects-storage',
            storage: createJSONStorage(() => AppStorage),
        }
    )
);