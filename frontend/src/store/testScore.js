import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTestStore = create(
  persist(
    (set) => ({
      subjects: [],
      systems: [],
      numQuestions: 0,

      setTestData: ({ subjects, systems, numQuestions }) =>
        set({ subjects, systems, numQuestions }),

      resetTestData: () => set({ subjects: [], systems: [], numQuestions: 0 }),
    }),
    {
      name: 'lms-test', // key in localStorage
    }
  )
);

export default useTestStore;
