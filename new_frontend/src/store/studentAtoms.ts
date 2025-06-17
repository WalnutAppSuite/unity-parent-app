import { atom } from 'jotai';
import type { Student } from '@/types/students';

export const studentsAtom = atom<Student[]>([]);