import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const opportunitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  company: z.string().min(1, 'Company is required').max(100, 'Company must be less than 100 characters'),
  contact: z.string().min(1, 'Contact is required').max(100, 'Contact must be less than 100 characters'),
  value: z.string().min(1, 'Value is required').regex(/^\d+(\.\d{2})?$/, 'Value must be a valid number'),
  stage: z.enum(['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won']),
  award_type: z.enum(['Contract', 'Grant', 'Cooperative Agreement', 'Purchase Order']),
  agency: z.string().min(1, 'Agency is required').max(100, 'Agency must be less than 100 characters'),
  solicitation: z.string().min(1, 'Solicitation is required').max(50, 'Solicitation must be less than 50 characters'),
  probability: z.number().min(0, 'Probability must be at least 0').max(100, 'Probability must be at most 100'),
  close_date: z.string().min(1, 'Close date is required'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  pinned: z.boolean(),
  tenant_id: z.string().uuid('Invalid tenant ID format'),
  created_by: z.string().uuid('Invalid created by ID format')
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOpportunityModal({ isOpen, onClose }: CreateOpportunityModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: '',
      company: '',
      contact: '',
      value: '',
      stage: 'Lead',
      award_type: 'Contract',
      agency: '',
      solicitation: '',
      probability: 30,
      close_date: '',
      description: '',
      pinned: false,
      tenant_id: '550e8400-e29b-41d4-a716-446655440000', // Default value
      created_by: '23387f34-b491-4905-bcbb-24300848cfcb' // Default value
    }
  });

  const onSubmit = async (data: OpportunityFormData) => {
    setIsSubmitting(true);
    
    console.log('🚀 [CREATE OPPORTUNITY] Form submitted with data:', data);
    console.log('📊 [CREATE OPPORTUNITY] Formatted data:', {
      ...data,
      value: parseFloat(data.value),
      probability: Number(data.probability)
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ [CREATE OPPORTUNITY] Opportunity created successfully');
    
    setIsSubmitting(false);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Opportunity</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter opportunity title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact */}
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Value */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value *</FormLabel>
                    <FormControl>
                      <Input placeholder="75000.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Probability */}
              <FormField
                control={form.control}
                name="probability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Probability (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stage */}
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                        <SelectItem value="Closed Won">Closed Won</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Award Type */}
              <FormField
                control={form.control}
                name="award_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Award Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select award type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Grant">Grant</SelectItem>
                        <SelectItem value="Cooperative Agreement">Cooperative Agreement</SelectItem>
                        <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Agency */}
              <FormField
                control={form.control}
                name="agency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter agency name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Solicitation */}
              <FormField
                control={form.control}
                name="solicitation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solicitation *</FormLabel>
                    <FormControl>
                      <Input placeholder="TEST-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Close Date */}
              <FormField
                control={form.control}
                name="close_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Close Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pinned */}
              <FormField
                control={form.control}
                name="pinned"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Pinned</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter opportunity description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden fields for tenant_id and created_by */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tenant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="created_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created By</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Opportunity'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}