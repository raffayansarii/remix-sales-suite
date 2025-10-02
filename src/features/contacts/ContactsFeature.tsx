import { useState } from 'react';
import { Search, Plus, Mail, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockContacts } from '@/data/mockData';
import { Contact } from '@/types/crm';
import { useGetTenantsQuery } from '@/api/tenants/tenantsApi';

export function ContactsFeature() {
  // TODO: Replace with API call - GET /api/contacts
  const [contacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('👥 [CONTACTS] ContactsFeature initialized with contacts:', contacts.length);

  const {data} = useGetTenantsQuery({})
  console.log(data)
  // TODO: Replace with backend search - POST /api/contacts/search  
  const filteredContacts = contacts.filter(contact => 
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('🔍 [CONTACTS] Filtered contacts:', filteredContacts.length, 'of', contacts.length);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/30">
      {/* Header Section */}
      <div className="bg-background border-b p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
            <p className="text-muted-foreground mt-1">Manage your customer database</p>
          </div>
          
          <Button className="gap-2 bg-gradient-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4" />
            Add Contact
            {/* TODO: Add onClick handler for creating new contact - POST /api/contacts */}
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => {
              console.log('🔍 [CONTACTS] Search term changed:', e.target.value);
              setSearchTerm(e.target.value);
              // TODO: Debounce search and call backend API
            }}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="bg-background hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 bg-gradient-primary">
                    <AvatarFallback className="text-white font-medium">
                      {getInitials(contact.firstName, contact.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{contact.position}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-3 h-3" />
                        <span>{contact.company}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 text-xs text-muted-foreground">
                      Added {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No contacts found</h3>
            <p className="text-sm">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first contact.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}