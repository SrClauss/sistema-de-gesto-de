import { createContext, useContext, useState, useMemo } from 'react';
import { initialData } from '../data/mock';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(initialData)));
  const [modulo, setModulo] = useState('gerencial');
  const [colaboradorLogado, setColaboradorLogado] = useState(data.catalogos.colaboradores[0]);

  const findTarefa = (taskId) => {
    for (const emp of data.empresas) {
      for (const prj of emp.projetos) {
        for (const doc of prj.documentos) {
          const tarefa = doc.tarefas.find((t) => t.id === taskId);
          if (tarefa) return { empresa: emp, projeto: prj, documento: doc, tarefa };
        }
      }
    }
    return null;
  };

  const findDocumento = (docId) => {
    for (const emp of data.empresas) {
      for (const prj of emp.projetos) {
        const doc = prj.documentos.find((d) => d.id === docId);
        if (doc) return { empresa: emp, projeto: prj, documento: doc };
      }
    }
    return null;
  };

  const executarTarefa = (taskId) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findTarefa(taskId);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc) => {
                if (doc.id !== found.documento.id) return doc;
                return {
                  ...doc,
                  tarefas: doc.tarefas.map((t) => {
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

  const validarTarefa = (taskId) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findTarefa(taskId);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc) => {
                if (doc.id !== found.documento.id) return doc;
                return {
                  ...doc,
                  tarefas: doc.tarefas.map((t) => {
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

  const atribuirResponsavelTarefa = (taskId, colabId) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findTarefa(taskId);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc) => {
                if (doc.id !== found.documento.id) return doc;
                return {
                  ...doc,
                  tarefas: doc.tarefas.map((t) => {
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

  const atribuirResponsavelDocumento = (docId, colabId, migrarTarefas) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findDocumento(docId);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc) => {
                if (doc.id !== docId) return doc;
                const newDoc = { ...doc, responsavel_id: colabId };
                if (migrarTarefas) {
                  newDoc.tarefas = newDoc.tarefas.map((t) => ({ ...t, responsavel_id: colabId }));
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

  const atribuirResponsavelEmpresa = (empId, colabId, migrarDocs, migrarTarefas) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));

      newData.empresas = newData.empresas.map((emp) => {
        if (emp.id !== empId) return emp;
        const newEmp = { ...emp, responsavel_principal_id: colabId };
        if (migrarDocs) {
          newEmp.projetos = newEmp.projetos.map((prj) => ({
            ...prj,
            documentos: prj.documentos.map((doc) => {
              const newDoc = { ...doc, responsavel_id: colabId };
              if (migrarTarefas) {
                newDoc.tarefas = newDoc.tarefas.map((t) => ({ ...t, responsavel_id: colabId }));
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

  const atribuirEmMassa = ({ tipoId, dataInicio, dataFim, novoColabId, escopo }) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const hoje = new Date().toISOString().split('T')[0];

      newData.empresas = newData.empresas.map((emp) => ({
        ...emp,
        projetos: emp.projetos.map((prj) => ({
          ...prj,
          documentos: prj.documentos.map((doc) => ({
            ...doc,
            tarefas: doc.tarefas.map((t) => {
              if (tipoId && t.tipo_id !== tipoId) return t;

              if (escopo === 'period') {
                if (t.vencimento < dataInicio || t.vencimento > dataFim) return t;
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

  const resolverPrereq = (docId) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const found = findDocumento(docId);
      if (!found) return prev;

      newData.empresas = newData.empresas.map((emp) => {
        if (emp.id !== found.empresa.id) return emp;
        return {
          ...emp,
          projetos: emp.projetos.map((prj) => {
            if (prj.id !== found.projeto.id) return prj;
            return {
              ...prj,
              documentos: prj.documentos.map((doc) => {
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

  const value = {
    data,
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
    kpis,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
