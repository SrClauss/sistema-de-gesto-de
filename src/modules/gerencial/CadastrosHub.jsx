import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriasModule } from './Categorias';
import { EmpresasModule } from './Empresas';
import { ColaboradoresModule } from './Colaboradores';

export function CadastrosHub() {
  const [activeTab, setActiveTab] = useState('empresas');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b px-8 pt-8">
          <TabsList className="h-12">
            <TabsTrigger value="empresas" className="text-base px-6">
              Empresas
            </TabsTrigger>
            <TabsTrigger value="categorias" className="text-base px-6">
              Categorias
            </TabsTrigger>
            <TabsTrigger value="colaboradores" className="text-base px-6">
              Colaboradores
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="empresas" className="m-0">
          <EmpresasModule />
        </TabsContent>

        <TabsContent value="categorias" className="m-0">
          <CategoriasModule />
        </TabsContent>

        <TabsContent value="colaboradores" className="m-0">
          <ColaboradoresModule />
        </TabsContent>
      </Tabs>
    </div>
  );
}
