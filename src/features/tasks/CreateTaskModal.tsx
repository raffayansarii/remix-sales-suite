import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCreateTaskMutation } from "@/api/tasks/tasksApi";
import { useLazyGetOpportunitiesQuery } from "@/api/opportunity/opportunityApi";
import { useToast } from "@/hooks/use-toast";
import { AsyncSelect } from "@/components/ui/AsyncSearchDropdown";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import { useLazyGetAllUsersQuery } from "@/api/auth/authApi";
import { IUser } from "@/api/auth/authTypes";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  due_date: z.date({ required_error: "Due date is required" }),
  priority: z.enum(["Low", "Medium", "High"]),
  assigned_to: z.string().optional(),
  opportunity_id: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskModal({ open, onOpenChange }: CreateTaskModalProps) {
  const { toast } = useToast();
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [triggerOpps, oppStatus] = useLazyGetOpportunitiesQuery();
  const [triggerUsers, userStatus] = useLazyGetAllUsersQuery();
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      assigned_to: "",
      opportunity_id: "",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTask({
        ...data,
        due_date: data.due_date.toISOString(),
        completed: false,
      }).unwrap();

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to track your activities
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Task description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name="assigned_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <Input placeholder="User ID or name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <AsyncSelect
              getOptionLabel={(user: IUser) => user.email}
              fetchOptions={async (params) => {
                console.log("Fetching users with params:", params);
                const res = await triggerUsers(params).unwrap();
                return res.users;
              }}
              renderOption={(user: IUser) => <span>{user.email}</span>}
              onSelect={(user: IUser) => {
                form.setValue("assigned_to", user.id);
              }}
              placeholder="User ID Or email"
              label="Assigned To"
              searchKey="email"
            />
            <AsyncSelect
              getOptionLabel={(tenant: IOpportunity) => tenant.title}
              fetchOptions={async (params) => {
                console.log("Fetching tenants with params:", params);
                const res = await triggerOpps(params).unwrap();
                return res.data; // { data, pagination }
              }}
              renderOption={(tenant) => <span>{tenant.title}</span>}
              onSelect={(opp) => {
                form.setValue("opportunity_id", opp.id);
              }}
              placeholder="Link to opportunity"
              label="Opportunity"
              searchKey="title"
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
