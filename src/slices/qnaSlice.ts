import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface QnaState {
    questionsByPage: {
        [key: string]: {
            questions: any[];
        };
    };
    currentPage: string | null;
}

const initialState: QnaState = {
    questionsByPage: {}, // Start with an empty object
    currentPage: null
};

const qnaSlice = createSlice({
    name: 'qna',
    initialState,
    reducers: {
        setQnaQuestions: (state, action: PayloadAction<{ page: string; questions: any[] }>) => {
            const { page, questions } = action.payload;
            if (!state.questionsByPage[page]) {
                state.questionsByPage[page] = { questions: [] }; // Initialize if not present
            }
            
            const existingQuestions = state.questionsByPage[page].questions;
            
            // Process each new question
            questions.forEach(newQuestion => {
                // Find if this question already exists (by question_id)
                const existingIndex = existingQuestions.findIndex(q => q.question_id === newQuestion.question_id);
                
                if (existingIndex !== -1) {
                    // Update existing question
                    existingQuestions[existingIndex] = newQuestion;
                } else {
                    // Add new question
                    existingQuestions.push(newQuestion);
                }
            });
            
            // Update the questions array
            state.questionsByPage[page].questions = existingQuestions;
        },
        clearQnaQuestions: (state, action: PayloadAction<string>) => {
            const page = action.payload;
            if (state.questionsByPage[page]) {
                state.questionsByPage[page].questions = []; // Clear questions for the specific page
            }
        },
        clearAllQnaQuestions: (state) => {
            // Reset questionsByPage to its initial state
            state.questionsByPage = {}; // Clear all questions
        },
        setCurrentPage: (state, action: PayloadAction<string>) => {
            state.currentPage = action.payload;
            // Initialize questions for the current page if not already present
            if (!state.questionsByPage[state.currentPage]) {
                state.questionsByPage[state.currentPage] = { questions: [] };
            }
        }
    }
});

export const {
    setQnaQuestions,
    clearQnaQuestions,
    clearAllQnaQuestions,
    setCurrentPage
} = qnaSlice.actions;

export const selectQnaQuestions = (state: RootState, page: string) => state.qnaSlice.questionsByPage[page]?.questions || [];
export const selectAllQnaQuestions = (state: RootState) => state.qnaSlice.questionsByPage || {};
export const getCurrentPage = (state: RootState) => state.qnaSlice.currentPage;

export default qnaSlice.reducer; 