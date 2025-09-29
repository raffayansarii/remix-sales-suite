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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PermissionGuard } from '@/components/guards';
import { Calendar, DollarSign, User, Building, FileText, Tag, Clock, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { IOpportunity } from '@/api/opportunity/opportunityTypes';

const opportunitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  company: z.string().min(1, 'Company is required').max(100, 'Company must be less than 100 characters'),
  contact: z.string().min(1, 'Contact is required').max(100, 'Contact must be less than 100 characters'),
  value: z.number().min(0, 'Value must be positive'),
  stage: z.string().min(1, 'Stage is required'),
  award_type: z.string().min(1, 'Award type is required'),
  agency: z.string().min(1, 'Agency is required').max(100, 'Agency must be less than 100 characters'),
  solicitation: z.string().min(1, 'Solicitation is required').max(100, 'Solicitation must be less than 100 characters'),
  probability: z.number().min(0, 'Probability must be between 0 and 100').max(100, 'Probability must be between 0 and 100'),
  close_date: z.string().min(1, 'Close date is required'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface OpportunityDetailModalProps {
  opportunity: IOpportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (updatedOpportunity: IOpportunity) => void;
  onDelete?: (opportunityId: string) => void;
}

export function OpportunityDetailModal({ 
  opportunity, 
  open, 
  onOpenChange, 
  onUpdate, 
  onDelete 
}: OpportunityDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: '',
      company: '',
      contact: '',
      value: 0,
      stage: '',
      award_type: '',
      agency: '',
      solicitation: '',
      probability: 0,
      close_date: '',
      description: '',
    }
  });

  if (!opportunity) return null;

  const handleEdit = () => {
    // Populate form with current opportunity data
    form.reset({
      title: opportunity.title,
      company: opportunity.company,
      contact: opportunity.contact,
      value: opportunity.value,
      stage: opportunity.stage,
      award_type: opportunity.award_type,
      agency: opportunity.agency,
      solicitation: opportunity.solicitation,
      probability: opportunity.probability,
      close_date: opportunity.close_date,
      description: opportunity.description || '',
    });
    setIsEditing(true);
  };

  const handleSave = (data: OpportunityFormData) => {
    const updatedOpportunity: IOpportunity = {
      ...opportunity,
      ...data,
    };
    
    console.log('🚀 [OPPORTUNITY MODAL] Form submitted with data:', data);
    console.log('🔄 [API CALL] PUT /api/opportunities/' + opportunity.id, updatedOpportunity);
    
    onUpdate?.(updatedOpportunity);
    setIsEditing(false);
    toast.success('Opportunity updated successfully');
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log('🗑️ [API CALL] DELETE /api/opportunities/' + opportunity.id);
    
    onDelete?.(opportunity.id);
    onOpenChange(false);
    toast.success('Opportunity deleted successfully');
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead': return 'bg-blue-500';
      case 'Qualified': return 'bg-yellow-500';
      case 'Proposal': return 'bg-orange-500';
      case 'Negotiation': return 'bg-purple-500';
      case 'Closed Won': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAwardTypeColor = (awardType: string) => {
    switch (awardType) {
      case 'Contract': return 'bg-indigo-500';
      case 'Grant': return 'bg-emerald-500';
      case 'Cooperative Agreement': return 'bg-cyan-500';
      case 'Purchase Order': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {isEditing ? 'Edit Opportunity' : 'Opportunity Details'}
            </DialogTitle>
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <PermissionGuard permission="opportunities:edit">
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </PermissionGuard>
                  <PermissionGuard permission="opportunities:delete">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{opportunity.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </PermissionGuard>
                </>
              )}
              {isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" form="opportunity-form" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {isEditing ? (
              <Form {...form}>
                <form id="opportunity-form" onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Building className="w-5 h-5 mr-2" />
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Value</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Status & Timing */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Clock className="w-5 h-5 mr-2" />
                          Status & Timing
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="stage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stage</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Lead">Lead</SelectItem>
                                    <SelectItem value="Qualified">Qualified</SelectItem>
                                    <SelectItem value="Proposal">Proposal</SelectItem>
                                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                                    <SelectItem value="Closed Won">Closed Won</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="award_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Award Type</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Grant">Grant</SelectItem>
                                    <SelectItem value="Cooperative Agreement">Cooperative Agreement</SelectItem>
                                    <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="probability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Probability</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  max="100" 
                                  {...field} 
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="close_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Close Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Government Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Government Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="agency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agency</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="solicitation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Solicitation</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea rows={4} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </form>
              </Form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Building className="w-5 h-5 mr-2" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <p className="text-sm font-medium">{opportunity.title}</p>
                      </div>

                      <div>
                        <Label htmlFor="company">Company</Label>
                        <p className="text-sm">{opportunity.company}</p>
                      </div>

                      <div>
                        <Label htmlFor="contact">Contact</Label>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{opportunity.contact}</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="value">Value</Label>
                        <div className="flex items-center gap-2 text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            ${opportunity.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status & Timing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Status & Timing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="stage">Stage</Label>
                        <Badge className={`${getStageColor(opportunity.stage)} text-white border-0`}>
                          {opportunity.stage}
                        </Badge>
                      </div>

                      <div>
                        <Label htmlFor="award_type">Award Type</Label>
                        <Badge className={`${getAwardTypeColor(opportunity.award_type)} text-white border-0`}>
                          {opportunity.award_type}
                        </Badge>
                      </div>

                      <div>
                        <Label htmlFor="probability">Probability</Label>
                        <p className="text-sm">{opportunity.probability}%</p>
                      </div>

                      <div>
                        <Label htmlFor="close_date">Close Date</Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(opportunity.close_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Government Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Government Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agency">Agency</Label>
                      <p className="text-sm">{opportunity.agency}</p>
                    </div>

                    <div>
                      <Label htmlFor="solicitation">Solicitation</Label>
                      <p className="text-sm font-mono">{opportunity.solicitation}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {opportunity.description || 'No description available'}
                    </p>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Tag className="w-5 h-5 mr-2" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {opportunity?.tags?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {opportunity.tags.map((tag, index) => (
                          <Badge key={tag.id || index} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags added</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Opportunity Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(opportunity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(opportunity.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notes & Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Notes functionality coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}