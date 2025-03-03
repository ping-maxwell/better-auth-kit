export declare const schema: {
    waitlist: {
        fields: {
            email: {
                type: "string";
                required: true;
                input: true;
            };
            joinedAt: {
                type: "date";
                required: true;
                input: false;
                defaultValue: Date;
            };
        };
    };
};
export type WaitlistUser = {
    id: string;
    email: string;
    name: string;
    joinedAt: Date;
};
