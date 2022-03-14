export interface IAlert {
    description: string;
    end: number;
    event: string;
    sender_name: string;
    start: number;
    tags: Array<string>;
}