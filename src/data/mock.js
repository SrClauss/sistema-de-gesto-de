import { colaboradores } from './colaboradores';
import { statusTarefa } from './status';
import { tiposTarefa } from './tipos-tarefa';
import { empresas } from './empresas';

export const initialData = {
  catalogos: {
    colaboradores,
    status_tarefa: statusTarefa,
    tipos_tarefa: tiposTarefa,
  },
  empresas,
};
