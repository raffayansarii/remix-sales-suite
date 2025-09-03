import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { mockTasks } from '@/data/mockData';
import { Task } from '@/types/crm';

export function TasksFeature() {
  // TODO: Replace with API call - GET /api/tasks
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  console.log('✅ [TASKS] TasksFeature initialized with tasks:', tasks.length);

  // TODO: Replace with backend filtering - POST /api/tasks/filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && !task.completed) ||
                         (filter === 'completed' && task.completed);
    return matchesSearch && matchesFilter;
  });

  console.log('🔍 [TASKS] Filtered tasks:', filteredTasks.length, 'of', tasks.length);

  const toggleTaskCompletion = (taskId: string) => {
    console.log('🔄 [TASKS] Toggling task completion:', taskId);
    
    // Optimistic update
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    // TODO: Replace with API call - PATCH /api/tasks/${taskId} { completed: !completed }
    console.log('🌐 [API] Would call PATCH /api/tasks/' + taskId, { completed: true });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'Medium': return <Clock className="w-4 h-4 text-warning" />;
      case 'Low': return <CheckCircle className="w-4 h-4 text-success" />;
      default: return null;
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/30">
      {/* Header Section */}
      <div className="bg-background border-b p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage and track your activities</p>
          </div>
          
          <Button className="gap-2 bg-gradient-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4" />
            Add Task
            {/* TODO: Add onClick handler for creating new task - POST /api/tasks */}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => {
                console.log('🔍 [TASKS] Search term changed:', e.target.value);
                setSearchTerm(e.target.value);
                // TODO: Debounce search and call backend API
              }}
              className="pl-10 bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({tasks.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending ({pendingTasks})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed ({completedTasks})
            </Button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(task.priority)}
                        <Badge 
                          variant={task.priority === 'High' ? 'destructive' : 
                                  task.priority === 'Medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      {task.assignedTo && <span>Assigned to: {task.assignedTo}</span>}
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-sm">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first task.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}