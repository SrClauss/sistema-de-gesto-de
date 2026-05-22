import { useState, useEffect } from 'react';
import { Shell } from './components/layout/Shell';
import { Dashboard } from './modules/gerencial/Dashboard';
import { ProjectList } from './modules/gerencial/ProjectList';
import { CompanyDetail } from './modules/gerencial/CompanyDetail';
import { Calendar } from './modules/gerencial/Calendar';
import { CadastrosHub } from './modules/gerencial/CadastrosHub';
import { MyTasks } from './modules/colaborador/MyTasks';
import { CompanyPortal } from './modules/empresa/CompanyPortal';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  useEffect(() => {
    const handleNavigate = (e) => {
      if (e.detail && typeof e.detail === 'object') {
        setCurrentView(e.detail.view);
        if (e.detail.empresa) setSelectedEmpresa(e.detail.empresa);
      } else {
        setCurrentView(e.detail);
        if (e.detail !== 'carteira') setSelectedEmpresa(null);
      }
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const renderContent = () => {
    if (currentView === 'dashboard') {
      return <Dashboard />;
    } else if (currentView === 'carteira') {
      if (selectedEmpresa) {
        return <CompanyDetail empresa={selectedEmpresa} onBack={() => setSelectedEmpresa(null)} />;
      }
      return <ProjectList onSelectEmpresa={setSelectedEmpresa} />;
    } else if (currentView === 'calendario') {
      return <Calendar />;
    } else if (currentView === 'cadastros') {
      return <CadastrosHub />;
    } else if (currentView === 'minhas-tarefas') {
      return <MyTasks />;
    } else if (currentView === 'portal') {
      return <CompanyPortal />;
    }
    return <Dashboard />;
  };

  return (
    <Shell>
      {renderContent()}
    </Shell>
  );
}

export default App;