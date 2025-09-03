import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormulaBuilderModal } from './FormulaBuilderModal';

export function CreateColumnButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateColumn = (columnData: { name: string; formula: string }) => {
    console.log('📊 [FORMULA] Creating column:', columnData);
    // TODO: Replace with actual backend API call
    // Expected API: POST /api/opportunities/columns
    // Body: { name: columnData.name, formula: columnData.formula }
    console.log('🌐 [API] Would call POST /api/opportunities/columns', columnData);
    
    // TODO: After successful creation, refresh the opportunities data
    // and update the table/kanban view to show the new calculated column
    
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="gap-2 border-dashed hover:border-primary/40"
      >
        <Plus className="w-4 h-4" />
        Create Column
      </Button>
      
      <FormulaBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateColumn={handleCreateColumn}
      />
    </>
  );
}