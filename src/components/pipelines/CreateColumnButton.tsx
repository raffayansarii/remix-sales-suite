import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormulaBuilderModal } from './FormulaBuilderModal';

export function CreateColumnButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateColumn = (columnData: { name: string; formula: string }) => {
    console.log('Creating column:', columnData);
    // TODO: Implement actual column creation logic
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