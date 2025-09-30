import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterGroupProps, FILTER_FIELDS, getOperatorsForField  } from './types-and-schemas';


export function FilterGroup({ group, onUpdate, onRemove, canRemove }: FilterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedField = FILTER_FIELDS.find(f => f.value === group.field);
  const availableOperators = selectedField ? getOperatorsForField(selectedField.type) : [];
  
  const handleFieldChange = (field: string) => {
    const fieldConfig = FILTER_FIELDS.find(f => f.value === field);
    const operators = fieldConfig ? getOperatorsForField(fieldConfig.type) : [];
    onUpdate({
      ...group,
      field,
      operator: operators[0]?.value || '',
      value: fieldConfig?.type === 'select' && fieldConfig.options ? fieldConfig.options[0] : ''
    });
  };

  const handleOperatorChange = (operator: string) => {
    onUpdate({ ...group, operator });
  };

  const handleValueChange = (value: string | string[]) => {
    onUpdate({ ...group, value });
  };

  const renderValueInput = () => {
    if (!selectedField) return null;

    const operatorRequiresMultiple = ['contains_any_of', 'contains_all_of', 'ends_with_any_of', 'starts_with_any_of'].includes(group.operator);
    const operatorRequiresNoValue = ['is_empty', 'is_not_empty'].includes(group.operator);

    if (operatorRequiresNoValue) {
      return (
        <div className="text-sm text-muted-foreground italic">
          No value required for this operator
        </div>
      );
    }

    if (selectedField.type === 'select' && selectedField.options) {
      if (operatorRequiresMultiple) {
        return (
          <div className="space-y-2">
            <Label className="text-sm">Values (one per line)</Label>
            <Textarea
              placeholder="Enter values, one per line"
              value={Array.isArray(group.value) ? group.value.join('\n') : group.value}
              onChange={(e) => handleValueChange(e.target.value.split('\n').filter(v => v.trim()))}
              rows={4}
              className="resize-none"
            />
          </div>
        );
      }
      return (
        <Select value={group.value as string} onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {selectedField.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (selectedField.type === 'date') {
      const [date, setDate] = useState<Date>();
      
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background border shadow-lg" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate) {
                  handleValueChange(format(newDate, 'yyyy-MM-dd'));
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      );
    }

    if (operatorRequiresMultiple) {
      return (
        <div className="space-y-2">
          <Label className="text-sm">Values (one per line)</Label>
          <Textarea
            placeholder="Enter values, one per line"
            value={Array.isArray(group.value) ? group.value.join('\n') : group.value}
            onChange={(e) => handleValueChange(e.target.value.split('\n').filter(v => v.trim()))}
            rows={4}
            className="resize-none"
          />
        </div>
      );
    }

    return (
      <Input
        type={selectedField.type === 'number' ? 'number' : 'text'}
        placeholder={`Enter ${selectedField.label.toLowerCase()}`}
        value={group.value as string}
        onChange={(e) => handleValueChange(e.target.value)}
      />
    );
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
          Filter Rule #{group.id}
        </Button>
        
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Field</Label>
              <Select value={group.field} onValueChange={handleFieldChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg max-h-60">
                  {FILTER_FIELDS.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Operator</Label>
              <Select value={group.operator} onValueChange={handleOperatorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg max-h-60">
                  {availableOperators.map((operator) => (
                    <SelectItem key={operator.value} value={operator.value}>
                      {operator.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Value</Label>
              {renderValueInput()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}