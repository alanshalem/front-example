import { getCasa, getConsultasSaldoByFilter, getDivisas, getRubro } from "@lib/services/ConsultasCM.services";
import React from "react";

export type TipoSaldo = 'mensual' | 'diario'

export const getAllConsultasSaldoTable = (
    setConsultasSaldoTable: (value: React.SetStateAction<any[]>) => void,
    setLoading: (value: React.SetStateAction<boolean>) => void,
    saldoFilters: {} = {},
    tipo: TipoSaldo
) => {
    const cmSaldoContableDTO: any = {
        "cmSaldoContableDTO": saldoFilters,
    };
    getConsultasSaldoByFilter(cmSaldoContableDTO, tipo)
        .then((result: any) => {
            setConsultasSaldoTable(result);
            setLoading(false);
        })
        .catch(() => {
            setConsultasSaldoTable([]);
            setLoading(false);
        });
};

export const getSaldoDivisas = (tipoSaldo:TipoSaldo, setDivisas: any) => {
    
    getDivisas(tipoSaldo)
        .then((result: any) => {
            setDivisas(result.map(item => ({ value: item, text: item })))
        })
        .catch((error) => {
            console.log(error)
        });
};

export const getSaldoRubro = (tipoSaldo:TipoSaldo, setRubros: any) => {
    
    getRubro(tipoSaldo)
        .then((result: any) => {
            setRubros(result.map(item => ({ value: item, text: item })))
        })
        .catch((error) => {
            console.log(error)
        });
};

export const getSaldoCasa = (tipoSaldo:TipoSaldo, setCasas: any) => {
    
    getCasa(tipoSaldo)
        .then((result: any) => {
            setCasas(result.map(item => ({ value: item, text: item })))
        })
        .catch((error) => {
            console.log(error)
        });
};


export const formatConsultasDate = (rawDate:string):string => {

    const year = rawDate.substring(0, 4);
    const month = rawDate.substring(4, 6);
    const day = rawDate.substring(6, 8);
    
    const formattedDate = `${day}/${month}/${year}`;
    
    return formattedDate
}


