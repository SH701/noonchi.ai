export interface MyAI {
  personaId: number;
  userId: number;
  name: string;
  gender: "MALE" | "FEMALE" | "NONE";
  age: number;
  aiRole: string;
  userRole: string;
  description: string;
  profileImageUrl: string;
  hiddenMeaning: string;
}
