import { IError } from "./error.interface";

export interface ICities {
    localTime: string;
    dayTime: string;
    background: string;
    temperature: number;
    iconName: string;
    weatherStatus: string;
    cityName: string;
    showInputError: IError;
    showSpinner: boolean;
}