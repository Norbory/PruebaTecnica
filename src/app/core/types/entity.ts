export interface Entity {
    id: number;
    razon: string;
    nombreEmpresa: string;
    identificacionFiscal : number;
    numeroTelefono: number;
    correoElectronico: string;
    sitioWeb: string;
    direccion: string;
    pais: string;
    facturacion: number;
    fechaEdicion: Date;
}