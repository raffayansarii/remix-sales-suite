import { ColumnDef } from "@/components/ui/data-table";
import { User } from "@/api/users/usersTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

const getRoleBadgeVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "destructive";
    case "manager":
      return "default";
    default:
      return "secondary";
  }
};

export const createUserColumns = (
  onEdit: (user: User) => void,
  onDelete: (userId: string) => void
): ColumnDef<User>[] => [
  {
    id: "name",
    header: "Name",
    cell: (user) => (
      <span className="font-medium">
        {user.first_name} {user.last_name}
      </span>
    ),
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "role",
    header: "Role",
    cell: (user) => (
      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (user) => (
      <Badge variant={user.is_active ? "default" : "secondary"}>
        {user.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "lastLogin",
    header: "Last Login",
    cell: (user) => (
      <span className="text-muted-foreground">
        {user.last_login
          ? format(new Date(user.last_login), "MMM d, yyyy")
          : "Never"}
      </span>
    ),
  },
  {
    id: "created",
    header: "Created",
    cell: (user) => (
      <span className="text-muted-foreground">
        {format(new Date(user.created_at), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    className: "text-right",
    cell: (user) => (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(user.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
