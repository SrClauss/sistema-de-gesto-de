import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { initialData } from '../data/mock';

interface Colaborador {
  id: string;
  nome: string;
  papel: string;
}

interface AppContextType {
  data: typeof initialData;
  setData: React.Dispatch<React.SetStateAction<typeof initialData>>;
  modulo: string;
  setModulo: (modulo: string) => void;
  colaboradorLogado: Colaborador;
  setColaboradorLogado: (colab: Colaborador) => void;
  executarTarefa: (taskId: string) => void;
  validarTarefa: (taskId: string) => void;
  atribuirResponsavelTarefa: (taskId: string, colabId: string) => void;
  atribuirResponsavelDocumento: (docId: string, colabId: string, migrarTarefas: boolean) => void;
  atribuirResponsavelEmpresa: (empId: string, colabId: string, migrarDocs: boolean, migrarTarefas: boolean) => void;
  atribuirEmMassa: (params: {
    tipoId?: string;
    dataInicio?: string;
    dataFim?: string;
    novoColabId: string;
    escopo: 'period' | 'future' | 'all';
  }) => void;
  resolverPrereq: (docId: string) => void;
  adicionarDocumentoModelo: (documento: any) => void;
  editarDocumentoModelo: (id: string, documento: any) => void;
  excluirDocumentoModelo: (id: string) => void;
  adicionarCondicionanteModelo: (condicionante: any) => void;
  editarCondicionanteModelo: (id: string, condicionante: any) => void;
  excluirCondicionanteModelo: (id: string) => void;
  kpis: {
    empresas: number;
    pendentes: number;
    atrasadas: number;
    concluidas: number;
    aguardando: number;
    docsBloqueados: number;
  };
}

const AppContext = createContext<AppContextType | null>(null);

export { AppContext };

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(initialData)));
  const [modulo, setModulo] = useState('gerencial');
  const [colaboradorLogado, setColaboradorLogado] = useState(data.catalogos.colaboradores[0]);

  const findTarefa = (taskId: string, currentData: typeof initialData) => {
    for (const emp of currentData.empresas) {
      for (const prj of emp.projetos) {
        for (const doc of prj.documentos) {
          const tarefa = doc.tarefas.find((t) => t.id === taskId);
          if (tarefa) return { empresa: emp, projeto: prj, documento: doc, tarefa };
        }
      }
    }
    return null;
  };

  const findDocumento = (docId: string, currentData: typeof initialData) => {
    for (const emp of currentData.empresas) {
      for (const prj of emp.projetos) {
        const doc = prj.documentos.find((d) => d.id === docId);
        if (doc) return { empresa: emp, projeto: prj, documento: doc };
      }
    }
    return null;
  };

  const executarTarefa = (taskId: string) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findTarefa(taskId, prev);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp: any) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj: any) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc: any) => {
                if (doc.id !== found.documento.id) return doc;
                return {
                  ...doc,
                  tarefas: doc.tarefas.map((t: any) => {
                    if (t.id !== taskId) return t;
                    return { ...t, status: 'Aguardando Validação' };
                  }),
                };
              }),
            };
          }),
        };
      });
      return newData;
    });
  };

  const validarTarefa = (taskId: string) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findTarefa(taskId, prev);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp: any) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj: any) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc: any) => {
                if (doc.id !== found.documento.id) return doc;
                return {
                  ...doc,
                  tarefas: doc.tarefas.map((t: any) => {
                    if (t.id !== taskId) return t;
                    return { ...t, status: 'Concluído' };
                  }),
                };
              }),
            };
          }),
        };
      });
      return newData;
    });
  };

  const atribuirResponsavelTarefa = (taskId: string, colabId: string) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findTarefa(taskId, prev);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp: any) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj: any) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc: any) => {
                if (doc.id !== found.documento.id) return doc;
                return {
                  ...doc,
                  tarefas: doc.tarefas.map((t: any) => {
                    if (t.id !== taskId) return t;
                    return { ...t, responsavel_id: colabId };
                  }),
                };
              }),
            };
          }),
        };
      });
      return newData;
    });
  };

  const atribuirResponsavelDocumento = (docId: string, colabId: string, migrarTarefas: boolean) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findDocumento(docId, prev);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp: any) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj: any) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc: any) => {
                if (doc.id !== docId) return doc;
                const newDoc = { ...doc, responsavel_id: colabId };
                if (migrarTarefas) {
                  newDoc.tarefas = newDoc.tarefas.map((t: any) => ({ ...t, responsavel_id: colabId }));
                }
                return newDoc;
              }),
            };
          }),
        };
      });
      return newData;
    });
  };

  const atribuirResponsavelEmpresa = (empId: string, colabId: string, migrarDocs: boolean, migrarTarefas: boolean) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));

      newData.empresas = newData.empresas.map((emp: any) => {
        if (emp.id !== empId) return emp;
        const newEmp = { ...emp, responsavel_principal_id: colabId };
        if (migrarDocs) {
          newEmp.projetos = newEmp.projetos.map((prj: any) => ({
            ...prj,
            documentos: prj.documentos.map((doc: any) => {
              const newDoc = { ...doc, responsavel_id: colabId };
              if (migrarTarefas) {
                newDoc.tarefas = newDoc.tarefas.map((t: any) => ({ ...t, responsavel_id: colabId }));
              }
              return newDoc;
            }),
          }));
        }
        return newEmp;
      });
      return newData;
    });
  };

  const atribuirEmMassa = ({ tipoId, dataInicio, dataFim, novoColabId, escopo }: {
    tipoId?: string;
    dataInicio?: string;
    dataFim?: string;
    novoColabId: string;
    escopo: 'period' | 'future' | 'all';
  }) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const hoje = new Date().toISOString().split('T')[0];

      newData.empresas = newData.empresas.map((emp: any) => ({
        ...emp,
        projetos: emp.projetos.map((prj: any) => ({
          ...prj,
          documentos: prj.documentos.map((doc: any) => ({
            ...doc,
            tarefas: doc.tarefas.map((t: any) => {
              if (tipoId && t.tipo_id !== tipoId) return t;

              if (escopo === 'period') {
                if (t.vencimento < dataInicio! || t.vencimento > dataFim!) return t;
              } else if (escopo === 'future') {
                if (t.vencimento < hoje) return t;
              }

              return { ...t, responsavel_id: novoColabId };
            }),
          })),
        })),
      }));
      return newData;
    });
  };

  const resolverPrereq = (docId: string) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findDocumento(docId, prev);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp: any) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj: any) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc: any) => {
                if (doc.id !== docId) return doc;
                return { ...doc, prereq_ok: true, motivo_bloqueio: '', pendencias_anteriores: [] };
              }),
            };
          }),
        };
      });
      return newData;
    });
  };

  const kpis = useMemo(() => {
    const empresas = data.empresas.length;
    let pendentes = 0;
    let atrasadas = 0;
    let concluidas = 0;
    let aguardando = 0;
    let docsBloqueados = 0;

    data.empresas.forEach((emp) => {
      emp.projetos.forEach((prj) => {
        prj.documentos.forEach((doc) => {
          if (!doc.prereq_ok) docsBloqueados++;
          doc.tarefas.forEach((t) => {
            if (t.status === 'Pendente') pendentes++;
            else if (t.status === 'Atrasado') atrasadas++;
            else if (t.status === 'Concluído') concluidas++;
            else if (t.status.startsWith('Aguardando')) aguardando++;
          });
        });
      });
    });

    return { empresas, pendentes, atrasadas, concluidas, aguardando, docsBloqueados };
  }, [data]);

  const adicionarDocumentoModelo = (documento: any) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const newId = `docmod_${Date.now()}`;
      newData.catalogos.documentos_modelo.push({ id: newId, ...documento });
      return newData;
    });
  };

  const editarDocumentoModelo = (id: string, documento: any) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const index = newData.catalogos.documentos_modelo.findIndex((d: any) => d.id === id);
      if (index !== -1) {
        newData.catalogos.documentos_modelo[index] = { id, ...documento };
      }
      return newData;
    });
  };

  const excluirDocumentoModelo = (id: string) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.catalogos.documentos_modelo = newData.catalogos.documentos_modelo.filter((d: any) => d.id !== id);
      return newData;
    });
  };

  const adicionarCondicionanteModelo = (condicionante: any) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const newId = `condmod_${Date.now()}`;
      newData.catalogos.condicionantes_modelo.push({ id: newId, ...condicionante });
      return newData;
    });
  };

  const editarCondicionanteModelo = (id: string, condicionante: any) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const index = newData.catalogos.condicionantes_modelo.findIndex((c: any) => c.id === id);
      if (index !== -1) {
        newData.catalogos.condicionantes_modelo[index] = { id, ...condicionante };
      }
      return newData;
    });
  };

  const excluirCondicionanteModelo = (id: string) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.catalogos.condicionantes_modelo = newData.catalogos.condicionantes_modelo.filter((c: any) => c.id !== id);
      return newData;
    });
  };

  const value = {
    data,
    setData,
    modulo,
    setModulo,
    colaboradorLogado,
    setColaboradorLogado,
    executarTarefa,
    validarTarefa,
    atribuirResponsavelTarefa,
    atribuirResponsavelDocumento,
    atribuirResponsavelEmpresa,
    atribuirEmMassa,
    resolverPrereq,
    adicionarDocumentoModelo,
    editarDocumentoModelo,
    excluirDocumentoModelo,
    adicionarCondicionanteModelo,
    editarCondicionanteModelo,
    excluirCondicionanteModelo,
    kpis,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
