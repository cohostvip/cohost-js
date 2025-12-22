import { Customer } from "../../types";


export interface UpdatableCartSession {
    customer?: Partial<Customer>;
}



export interface FindTablesProps {
    /** 
     * min group size
     */
    min: number;

    /**
     * max group size
     */
    max: number;

    /**
     * eligible table sectionss
     */
    sections: string[];
}


export interface ViableTableOption {
    id: string;
    groupSize: number;
}