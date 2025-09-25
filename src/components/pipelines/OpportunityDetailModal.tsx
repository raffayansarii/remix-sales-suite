import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PermissionGuard } from '@/components/guards';
import { Opportunity } from '@/types/crm';
import { Calendar, DollarSign, User, Building, FileText, Tag, Clock, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { IOpportunity } from '@/api/opportunity/opportunityTypes';

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
  const [editForm, setEditForm] = useState<IOpportunity | null>(null);

  if (!opportunity) return null;

  const handleEdit = () => {
    setEditForm({ ...opportunity });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editForm) {
      // TODO: Replace with actual API call to backend
      // PUT /api/opportunities/:id
      console.log('🔄 [API CALL] PUT /api/opportunities/' + editForm.id, editForm);
      
      onUpdate?.(editForm);
      setIsEditing(false);
      toast.success('Opportunity updated successfully');
    }
  };

  const handleCancel = () => {
    setEditForm(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // TODO: Replace with actual API call to backend  
    // DELETE /api/opportunities/:id
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

  const currentOpportunity = isEditing ? editForm! : opportunity;

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
                  <Button size="sm" onClick={handleSave}>
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
                    {isEditing ? (
                      <Input
                        id="title"
                        value={editForm?.title}
                        onChange={(e) => setEditForm(prev => prev ? {...prev, title: e.target.value} : null)}
                      />
                    ) : (
                      <p className="text-sm font-medium">{currentOpportunity.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    {isEditing ? (
                      <Input
                        id="company"
                        value={editForm?.company}
                        onChange={(e) => setEditForm(prev => prev ? {...prev, company: e.target.value} : null)}
                      />
                    ) : (
                      <p className="text-sm">{currentOpportunity.company}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contact">Contact</Label>
                    {isEditing ? (
                      <Input
                        id="contact"
                        value={editForm?.contact}
                        onChange={(e) => setEditForm(prev => prev ? {...prev, contact: e.target.value} : null)}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{currentOpportunity.contact}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="value">Value</Label>
                    {isEditing ? (
                      <Input
                        id="value"
                        type="number"
                        value={editForm?.value}
                        onChange={(e) => setEditForm(prev => prev ? {...prev, value: Number(e.target.value)} : null)}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          ${currentOpportunity.value.toLocaleString()}
                        </span>
                      </div>
                    )}
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
                    {isEditing ? (
                      <Select
                        value={editForm?.stage}
                        onValueChange={(value) => setEditForm(prev => prev ? {...prev, stage: value as any} : null)}
                      >
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
                    ) : (
                      <Badge className={`${getStageColor(currentOpportunity.stage)} text-white border-0`}>
                        {currentOpportunity.stage}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="award_type">Award Type</Label>
                    {isEditing ? (
                      <Select
                        value={editForm?.award_type}
                        onValueChange={(value) => setEditForm(prev => prev ? {...prev, award_type: value as any} : null)}
                      >
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
                    ) : (
                      <Badge className={`${getAwardTypeColor(currentOpportunity.award_type)} text-white border-0`}>
                        {currentOpportunity.award_type}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="probability">Probability</Label>
                    {isEditing ? (
                      <Input
                        id="probability"
                        type="number"
                        min="0"
                        max="100"
                        value={editForm?.probability}
                        onChange={(e) => setEditForm(prev => prev ? {...prev, probability: Number(e.target.value)} : null)}
                      />
                    ) : (
                      <p className="text-sm">{currentOpportunity.probability}%</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="close_date">Close Date</Label>
                    {isEditing ? (
                      <Input
                        id="close_date"
                        type="date"
                        value={editForm?.close_date}
                        onChange={(e) => setEditForm(prev => prev ? {...prev, close_date: e.target.value} : null)}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(currentOpportunity.close_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
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
                  {isEditing ? (
                    <Input
                      id="agency"
                      value={editForm?.agency}
                      onChange={(e) => setEditForm(prev => prev ? {...prev, agency: e.target.value} : null)}
                    />
                  ) : (
                    <p className="text-sm">{currentOpportunity.agency}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="solicitation">Solicitation</Label>
                  {isEditing ? (
                    <Input
                      id="solicitation"
                      value={editForm?.solicitation}
                      onChange={(e) => setEditForm(prev => prev ? {...prev, solicitation: e.target.value} : null)}
                    />
                  ) : (
                    <p className="text-sm font-mono">{currentOpportunity.solicitation}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editForm?.description || ''}
                    onChange={(e) => setEditForm(prev => prev ? {...prev, description: e.target.value} : null)}
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {currentOpportunity.description || 'No description available'}
                  </p>
                )}
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
                {currentOpportunity?.tags?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentOpportunity.tags.map((tag) => (
                      <Badge key={tag.name} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tags added</p>
                )}
              </CardContent>
            </Card>
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
                        {new Date(currentOpportunity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(currentOpportunity.updated_at).toLocaleDateString()}
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
                  Notes and comments feature coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}