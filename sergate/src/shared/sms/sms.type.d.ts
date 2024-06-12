export type Result = {
    success: number;
    to: string;
    from: string;
    id: string;
    error?: string;
};

export type Data = {
    result?: Array<Result>;
    error?: string;
    success: number;
};

export type Api = {
    success: boolean;
    cost: number;
    ms: number;
    pl_id: number;
};

export type Sms = {
    data: Data;
    api: Api;
};
