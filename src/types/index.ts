export interface Message {
  role: "human" | "ai";
  content: string;
  book_list?: BookData[];
  prompts?: string[];
  query_tag?: "query" | "summary";
}
export interface UserHistory {
  user_id: string;
  persona_id: string;
  session_id?: string;
  title?: string;
  messages: Message[];
}
export interface Persona {
  _id: string;
  persona_name: string;
  system_prompt_en: string;
  intro: string;
  intro_en: string;
  waiting_message: string[];
  system_prompt: string;
}
export interface BookData {
  keywords: string[];
  description: string;
  image: string;
  isbn: string;
  link: string;
  title: string;
}
