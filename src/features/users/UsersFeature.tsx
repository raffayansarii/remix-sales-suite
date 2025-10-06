import { useState } from "react";
import { useGetUsersQuery, useDeleteUserMutation } from "@/api/users/usersApi";
import { User } from "@/api/users/usersTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { CreateUserModal } from "./CreateUserModal";
import { EditUserModal } from "./EditUserModal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/ui/data-table";
import { createUserColumns } from "./columns";

export function UsersFeature() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Build query params
  const params: Record<string, string> = {};
  if (searchQuery) {
    params["or"] = `email.ilike.*${searchQuery}*,first_name.ilike.*${searchQuery}*,last_name.ilike.*${searchQuery}*`;
  }

  const { data: users = [], isLoading, error } = useGetUsersQuery(params);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async () => {
    if (!deletingUserId) return;

    try {
      await deleteUser(deletingUserId).unwrap();
      toast.success("User deleted successfully");
      setDeletingUserId(null);
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    }
  };

  const columns = createUserColumns(
    (user) => setEditingUser(user),
    (userId) => setDeletingUserId(userId)
  );

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Failed to load users. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No users found"
      />

      {/* Modals */}
      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      
      {editingUser && (
        <EditUserModal
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingUserId} onOpenChange={(open) => !open && setDeletingUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
