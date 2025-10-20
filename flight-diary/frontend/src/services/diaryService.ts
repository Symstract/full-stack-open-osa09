import axios, { type AxiosResponse } from "axios";
import type {
  DiaryEntry,
  ErrorResponse,
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
  SuccessResponse,
} from "../types";

const api = axios.create({ baseURL: "http://localhost:3000/api/diaries" });

export const getAllEntries = async (): Promise<
  SuccessResponse<NonSensitiveDiaryEntry[]> | ErrorResponse
> => {
  try {
    const response = await api.get<NonSensitiveDiaryEntry[]>("/");
    return { data: response.data, error: null, success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        data: null,
        error: { message: error.message, status: error.status },
        success: false,
      };
    } else {
      throw error;
    }
  }
};

export const createEntry = async (
  object: NewDiaryEntry
): Promise<SuccessResponse<DiaryEntry> | ErrorResponse> => {
  try {
    const response = await api.post<NewDiaryEntry, AxiosResponse<DiaryEntry>>(
      "/",
      object
    );
    return { data: response.data, error: null, success: true };
  } catch (error) {
    if (axios.isAxiosError<string>(error)) {
      return {
        data: null,
        error: {
          message: error.response?.data || error.message,
          status: error.status,
        },
        success: false,
      };
    } else {
      throw error;
    }
  }
};
