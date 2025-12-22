
export interface CohostErrorProps {
    /**
     * Optional error code.
     * @default undefined
     */
    errorCode?: string;

    /**
     * Optional status code.
     * @default undefined
     */
    statusCode?: number;
};

export class CohostError extends Error {
    errorCode: string | undefined;
    statusCode: number | undefined;

    /**
     * Custom error class for Cohost SDK errors.
     * @param message - The error message.
     */
    constructor(message: string, props?: CohostErrorProps) {
        // Call the parent constructor with the message
        super(message);

        // Set the name of the error to "CohostError"
        this.name = "CohostError";

        // Set the error code if provided
        this.errorCode = props?.errorCode;
        // Set the status code if provided
        this.statusCode = props?.statusCode;
    }

    static fromError(err: Error, props?: CohostErrorProps): CohostError {
        // Create a new CohostError instance from an existing error
        return new CohostError(err.message, {
            ...props,
            errorCode: props?.errorCode || err.name,
        });
    }

}




