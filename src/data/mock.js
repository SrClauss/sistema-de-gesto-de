import { colaboradores } from './colaboradores';
import { statusTarefa } from './status';
import { tiposTarefa } from './tipos-tarefa';
import { empresas } from './empresas';
import { categorias } from './categorias';
import { documentosModelo } from './documentos-modelo';
import { condicionantesModelo } from './condicionantes-modelo';

export const initialData = {
  catalogos: {
    colaboradores,
    status_tarefa: statusTarefa,
    tipos_tarefa: tiposTarefa,
    categorias,
    documentos_modelo: documentosModelo,
    condicionantes_modelo: condicionantesModelo,
  },
  empresas,
};
