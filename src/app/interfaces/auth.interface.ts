
export interface Login{
    email: string;
    password: string;
}

export interface Register{
    email: string;
    password: string;
    nombre: string;
    rol: number;
}

export interface JwtResponseModel{
    token: string;
    rol: string;
    nombre: string;
    id: string;
}