export interface AskReq {
  askTarget: string;
  closeness: string;
  situation: string;
}
export interface AskRes{
    messageId:number
    conversationId:number
    type:string
    content:string
    askApproachTip:string
    askCulturalInsight:string
    createdAt:string
}