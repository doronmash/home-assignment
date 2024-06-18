export interface IPosts {
    id: number;
    userId: number;
    date: string;
    content: string;
    likes?: number;
    likedBy?: number[];
}